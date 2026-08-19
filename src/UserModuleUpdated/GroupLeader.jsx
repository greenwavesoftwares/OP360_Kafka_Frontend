import { Dropdown } from "primereact/dropdown";

const GroupLeaderDropdown = ({
  value,
  options,
  onChange,
  isMobile,
  placeholder = "Select Approver",
}) => {
  const ellipsisStyle = {
    maxWidth: "10rem",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "block",
  };

  return (
    <Dropdown
      value={value ?? ""}
      options={options}
      optionValue="userID"
      optionLabel="userName"
      placeholder={placeholder}
      filter
      clearIcon
      style={{
        width: isMobile ? "6rem" : "100%",
        maxWidth: "10rem",
      }}
      onChange={onChange}
      itemTemplate={(option) => (
        <div title={`${option.userName} ( ${option.userID} )`}>
          <span style={{ fontWeight: "bold" }}>{option.userName}</span>
          {" ( " + option.userID + " )"}
        </div>
      )}
      valueTemplate={(option) =>
        option ? (
          <div
            className="flex align-items-center"
            style={ellipsisStyle}
            title={`${option.userName} ( ${option.userID} )`}
          >
            <span style={{ fontWeight: "bold" }}>
              {option.userName}
            </span>
            {" ( " + option.userID + " )"}
          </div>
        ) : (
          <span>{placeholder}</span>
        )
      }
    />
  );
};

export default GroupLeaderDropdown;
