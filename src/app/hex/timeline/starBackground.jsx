import "./starBackground.css"

export default function ({children}) {
  return (
    <>
      <div className="stars" />
      <div className="twinkling" />
      <div className="clouds" />
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
