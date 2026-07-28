import { WEBRTC_URL } from "@/constants";
import { useEffect, useRef, useState } from "react";

type ConnectionStatus = "idle" | "connecting" | "connected" | "failed";

export const useWebRtc = () => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("idle");

  useEffect(() => {
    return () => {
      pcRef.current?.close();
      pcRef.current = null;
    };
  }, []);

  async function waitForIceGathering(pc: RTCPeerConnection, maxWaitMs = 2000): Promise<void> {
    if (pc.iceGatheringState === "complete") return;
    await new Promise<void>((resolve) => {
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

  async function startStream() {
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

    pc.ontrack = (event: RTCTrackEvent) => {
      if (audioRef.current) {
        audioRef.current.srcObject = event.streams[0];
        audioRef.current.play().catch((err) => {
          console.error("Autoplay blocked:", err);
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

      if (offer.sdp) {
        offer.sdp = offer.sdp.replace("minptime=10;useinbandfec=1", "minptime=10;useinbandfec=1;stereo=1;sprop-stereo=1;maxaveragebitrate=256000");
      }

      await pc.setLocalDescription(offer);
      await waitForIceGathering(pc);

      const response = await fetch(WEBRTC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sdp: pc.localDescription?.sdp,
          type: pc.localDescription?.type,
        }),
      });

      if (!response.ok) {
        throw new Error(`Signaling server returned ${response.status}`);
      }

      const answer: RTCSessionDescriptionInit = await response.json();
      await pc.setRemoteDescription(answer);
    } catch (err) {
      console.error("Failed to establish connection:", err);
      setStatus("failed");
    }
  }

  function stopStream() {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setStatus("idle");
  }

  const toggleStream = () => {
    if (status == "connected") {
      stopStream();
    } else {
      startStream();
    }
  };

  return { toggleStream, stopStream, startStream, status, audioRef };
};
