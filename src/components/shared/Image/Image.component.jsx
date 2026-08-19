import React from "react";

function Image({ elem, height, width }) {
  return (
    <>
      <img
        // src={`/resources/logbookImages/${elem.imagePath}`}
        // src="D:/ReactSideBar/my-sidebar/public/logo512.png"
        src={"data:image/png;base64," + elem?.fileContent}
        height={elem?.imgHeight}
        width={elem?.imgWidth}
        alt={elem?.imagePath}
        // style={{ display: "block" }}
      />
    </>
  );
}

export default Image;
