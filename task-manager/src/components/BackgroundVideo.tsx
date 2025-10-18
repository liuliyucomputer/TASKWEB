'use client';

export function BackgroundVideo() {
  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="video-background"
      >
        <source
          src="https://cdn.pixabay.com/video/2023/05/10/161827-825172851_large.mp4"
          type="video/mp4"
        />
      </video>
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background -z-[1]" />
      <div className="fixed inset-0 grid-pattern -z-[1]" />
    </>
  );
}
