export default function LoadingScreen({ text = 'Loading...' }) {
  return (
    <div className="loading-screen">
      <div className="loader" />
      <div className="loading-text">{text}</div>
    </div>
  );
}
