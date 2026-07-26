import { useRef, useState } from "react";

const SIGNALING_URL = "http://berryaudio.local:8000/stream";

async function waitForIceGathering(pc, maxWaitMs = 2000) {
  if (pc.iceGatheringState === "complete") return;
  await new Promise((resolve) => {
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      pc.removeEventListener("icegatheringstatechange", check);
      clearTimeout(timer);
      resolve();
    }
    function check() {
      if (pc.iceGatheringState === "complete") finish();
    }
    pc.addEventListener("icegatheringstatechange", check);
    // Don't block forever on slow/unreachable STUN — host candidates on
    // a LAN are usually gathered within milliseconds, so if we haven't
    // completed by maxWaitMs, proceed with whatever we have.
    const timer = setTimeout(finish, maxWaitMs);
  });
}

export default function Start() {
  const pcRef = useRef(null);
  const audioRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | connecting | connected | failed
  const [error, setError] = useState(null);

  async function start() {
    setError(null);
    setStatus("connecting");

    // iOS Safari only allows audio playback to start if play() is called
    // synchronously within a user gesture. Calling it here (even though
    // there's no stream yet) "unlocks" the element so that attaching a
    // track later, inside the async ontrack callback, will actually play.
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {
        // Expected to reject since there's no source yet — that's fine,
        // the gesture has still been registered.
      });
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    pc.addTransceiver("audio", { direction: "recvonly" });

    pc.ontrack = (event) => {
      if (audioRef.current) {
        audioRef.current.srcObject = event.streams[0];
        audioRef.current.play().catch((err) => {
          console.error("Autoplay blocked:", err);
          setError("Audio blocked by browser autoplay policy — press play on the audio element.");
        });
      }
    };

    pc.onconnectionstatechange = () => {
      console.log("WebRTC connection state:", pc.connectionState);
    };

    // iOS/Safari's aggregate `connectionState` is known to be unreliable —
    // it can report "failed" even while ICE is actually connected and
    // audio keeps flowing. iceConnectionState is the more trustworthy
    // signal, so use that to drive the UI instead.
    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      const state = pc.iceConnectionState;
      if (state === "connected" || state === "completed") {
        setStatus("connected");
      } else if (state === "failed") {
        setStatus("failed");
      } else if (state === "disconnected") {
        // Often transient (brief network hiccup) — don't immediately
        // flip to a scary "failed" UI; only escalate if it doesn't
        // recover.
        setStatus("connecting");
      } else if (state === "closed") {
        setStatus("idle");
      }
    };

    try {
      const offer = await pc.createOffer();

      offer.sdp = offer.sdp.replace("minptime=10;useinbandfec=1", "minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=256000");

      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc);

      const response = await fetch(SIGNALING_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sdp: pc.localDescription.sdp,
          type: pc.localDescription.type,
        }),
      });

      if (!response.ok) {
        throw new Error(`Signaling server returned ${response.status}`);
      }

      const answer = await response.json();
      await pc.setRemoteDescription(answer);
    } catch (err) {
      console.error("Failed to establish connection:", err);
      setError(err.message);
      setStatus("failed");
    }
  }

  function stop() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setStatus("idle");
  }

  const statusColor = {
    idle: "bg-gray-400",
    connecting: "bg-yellow-500",
    connected: "bg-green-500",
    failed: "bg-red-500",
  }[status];

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 rounded-2xl border border-gray-200 shadow-sm bg-white">
      <h1 className="text-lg font-semibold text-gray-900 mb-1">Berry Audio Stream</h1>
      <p className="text-sm text-gray-500 mb-4">Live audio from the CamillaDSP loopback device.</p>

      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusColor}`} />
        <span className="text-sm text-gray-700 capitalize">{status}</span>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}

      <div className="flex gap-2 mb-4">
        <button
          onClick={start}
          disabled={status === "connecting" || status === "connected"}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-40"
        >
          Connect
        </button>
        <button
          onClick={stop}
          disabled={status === "idle"}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-40"
        >
          Disconnect
        </button>
      </div>

      <audio ref={audioRef} controls playsInline className="w-full" />
    </div>
  );
}
