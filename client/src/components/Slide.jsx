const Slide = () => {
  return (
    <section
      className="relative w-screen h-[80vh] bg-center bg-top bg-cover"
      style={{ backgroundImage: "url('/assets/slide.jpg')" }}
    >
      {/* overlay */}
      <div className="absolute inset-0 bg-black/50" />

      <h1 className="relative z-10 px-5 py-10 text-center text-white text-3xl md:text-4xl font-semibold">
        Welcome Home! Anywhere you roam
        <br />
        Stay in the moment. Make your memories
      </h1>
    </section>
  )
}

export default Slide
