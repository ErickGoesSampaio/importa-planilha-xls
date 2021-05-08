function sendInformation(data) {
  document.getElementById("upload-button").setAttribute("disabled", true);
  axios({
    method: "post",
    url: `${API_HOST}/files`,
    data,
  })
    .then(({ data }) => {
      console.log(data);
      alert(data.success);
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("upload-button").removeAttribute("disabled");
    });
}

function setElementsDisplay(file) {
  if (file) {
    document.getElementById("file-section").style.display = "none";
    document.getElementById("upload-section").style.display = "flex";
    document.getElementById("file-info").style.display = "flex";
    document.getElementById("file-description").innerText = file.name;
    document.getElementById("upload-button").removeAttribute("disabled");
  }
}

function convertXLSXToJson(file) {
  if (file) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const data = event.target.result;
      const workBook = XLSX.read(data, {
        type: "binary",
      });
      workBook.SheetNames.forEach((sheet) => {
        const finalData = XLSX.utils.sheet_to_row_object_array(
          workBook.Sheets[sheet]
        );
        finalData.length > 0 && sendInformation(finalData);
      });
    };
    fileReader.readAsBinaryString(file);
  }
}

function getFile() {
  const fileSelector = document.getElementById("file-input");
  fileSelector.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const uploadButton = document.getElementById("upload-button");

    setElementsDisplay(file);

    uploadButton.addEventListener("click", () => convertXLSXToJson(file));
  });
}