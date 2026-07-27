import { MonitorPlayIcon } from "@phosphor-icons/react";
import ButtonIcon from "./ButtonIcon";
import { ICON_SM, ICON_WEIGHT, WEBRTC_URL } from "@/constants";
import { useRef, useState } from "react";
import Spinner from "../Spinner";

const ButtonWebRtc = () => {
  const pcRef = useRef(null);
  const audioRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

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
      const timer = setTimeout(finish, maxWaitMs);
    });
  }

  async function start() {
    setError(null);
    setStatus("connecting");

    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.play().catch(() => {});
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

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      const state = pc.iceConnectionState;
      if (state === "connected" || state === "completed") {
        setStatus("connected");
      } else if (state === "failed") {
        setStatus("failed");
      } else if (state === "disconnected") {
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

      const response = await fetch(WEBRTC_URL, {
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

  const toggleStream = () => {
    if (status == "connected") {
      stop();
    } else {
      start();
    }
  };

  return (
    <>
      <ButtonIcon onClick={toggleStream} disabled={status === "connecting"} className={`${status === "connected" && "text-primary"}`}>
        {status === "connecting" ? <Spinner /> : <MonitorPlayIcon weight={ICON_WEIGHT} size={ICON_SM} />}
      </ButtonIcon>
      <audio ref={audioRef} controls playsInline className="hide" />
    </>
  );
};

export default ButtonWebRtc;
