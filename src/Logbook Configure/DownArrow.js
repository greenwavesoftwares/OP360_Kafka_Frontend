export default function DownArrow() {
  return (
    <div
      style={{
        borderRadius: "50%",
        paddingTop: "4px",
        backgroundColor: "#ffffff",
        color: "#1976d2",
        border: "1px solid rgba(25,118,210,0.2)",
        boxShadow: "rgb(163 148 148 / 12%) 0px 2px 10px 0px",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}
    >
      <svg
        width="38"
        height="28"
        viewBox="6 0 12 24"
        fill= "gray"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2v16m0 0l6-6m-6 6l-6-6"
          stroke="gray"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
