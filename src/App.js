import React, { useEffect, useState } from "react";
import "./App.css";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { Ellipsis } from "react-css-spinners";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  console.log("selectedFile: ", selectedFile);

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };
  const [numPages, setNumPages] = useState(null);

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);

  const [signedSuccessfully, setSignedSuccessfully] = useState(false);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleSubmission = () => {
    // calculate the has and an empty singature container
    // then pdf is stored on  relying party
    // redirect

    setLocalStorage();

    const formData = new FormData();

    formData.append("pdf-file", selectedFile);

    fetch("http://127.0.0.1:8001/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);

        window.location.replace(
          "http://localhost:8080/auth/realms/broker/protocol/openid-connect/auth?client_id=account&redirect_uri=http%3A%2F%2Flocalhost%3A3000&response_type=code&scope=openid&acr_values=qoa1&claims=%7B%22urn%3Acom%3Aswisscom%3AcredentialID%22%3A%7B%22value%22%3A%22qes_eidas%22%7D%2C%22urn%3Acom%3Aswisscom%3Adocname%22%3A%7B%22value%22%3A%22CoolContract.pdf%22%7D%2C%22urn%3Acom%3Aswisscom%3Ahash%22%3A%7B%22value%22%3A%2268627B2EABC506AA71F4851D0A36F7BD%22%7D%7D%0A"
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const setLocalStorage = () => {
    const pdfTitle = selectedFile.name.substring(0, selectedFile.name.length - 4);

    localStorage.setItem("pdfTitle", JSON.stringify({ pdfTitle }));
  };

  React.useEffect(() => {
    const queryString = window.location.href;
    const urlParams = new URLSearchParams(queryString);
    const pdfTitle = localStorage.getItem("pdfTitle");

    if (urlParams.has("code") && pdfTitle) {
      setLoading(true);
      signPdf();
    }
  }, []);

  const signPdf = () => {
    const pdfTitle = localStorage.getItem("pdfTitle");

    // temp sign
    fetch("http://127.0.0.1:8001/signpdf", {
      method: "POST",
      body: pdfTitle,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Success:", result);
        setLoading(false);
        setSignedSuccessfully(true);
      });
  };

  if (loading) return <Ellipsis />;

  if (signedSuccessfully)
    return (
      <div>
        <p>Signed successfully</p>
        <p>Download your pdf here</p>
        <button
          onClick={() => {
            const pdfTitleObj = localStorage.getItem("pdfTitle");
            const pdfTitle = JSON.parse(pdfTitleObj).pdfTitle;
            window.open("http://127.0.0.1:8001/uploads/" + pdfTitle, "_blank").focus();
          }}
        >
          Download
        </button>
        <button
          onClick={() => {
            setSignedSuccessfully(false);
            localStorage.removeItem("pdfTitle");
          }}
        >
          Reset flow
        </button>
      </div>
    );

  return (
    <div className="masthead">
      {isFilePicked && (
        <Document renderMode="svg" file={selectedFile} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} height={800} />
        </Document>
      )}
      <div className="interactionContainer">
        {/* make a custom button choose a pdf */}
        <input type="file" name="file" onChange={changeHandler} />
        {/* <input type='file' id='file' ref={inputFile} style={{display: 'none'}}/> */}

        {/* <button onClick={changeHandler}>Choose a PDF file</button> */}
        {isFilePicked ? (
          <div>
            <p>Filename: {selectedFile.name}</p>
            <p>Filetype: {selectedFile.type}</p>
            <p>Size in bytes: {selectedFile.size}</p>
            <p>lastModifiedDate: {selectedFile.lastModifiedDate.toLocaleDateString()}</p>
          </div>
        ) : (
          <p>Select a file to show details</p>
        )}
        {isFilePicked && (
          <div>
            <button onClick={handleSubmission}>Sign Document</button>
            <PageNumbers setPageNumber={setPageNumber} numPages={numPages} pageNumber={pageNumber} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

const PageNumbers = ({ pageNumber, setPageNumber, numPages }) => {
  return (
    <div style={{ marginTop: "16px" }}>
      <div>
        Page {pageNumber} of {numPages}
      </div>
      {pageNumber > 1 && <button onClick={() => setPageNumber((prevState) => prevState - 1)}>previous page</button>}
      {pageNumber >= 1 && pageNumber < numPages && (
        <button onClick={() => setPageNumber((prevState) => prevState + 1)}>next page</button>
      )}
    </div>
  );
};
