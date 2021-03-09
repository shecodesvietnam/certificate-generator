import React, { Component } from "react";
import { Link } from "react-router-dom";
import $ from "jquery";
import { Modal } from "react-bootstrap";
import axios from "axios";
import FileDownload from "js-file-download";
import { toast, ToastContainer } from "react-toastify";

import "./Homepage.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      template: null,
      canvasImg: null,
      isOpen: false,
      inputName: "",
      openDownload: false,
      csvFile: null,
      disableCSV: false,
      disableName: false,
      x: null,
      y: null,
    };
    this.onTemplateChange = this.onTemplateChange.bind(this);
    this.onCSVChange = this.onCSVChange.bind(this);
    this.resetFile = this.resetFile.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleImage = this.handleImage.bind(this);
    this.drawOverlayImage = this.drawOverlayImage.bind(this);
  }

  onTemplateChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0]),
      template: event.target.files[0],
    });
    $(".box-fileupload").hide();
  }

  onCSVChange(event) {
    var x = document.getElementById("upload-input");
    x.style.visibility = "collapse";
    document.getElementById("fileName").innerHTML = x.value.split("\\").pop();
    this.setState({
      csvFile: event.target.files[0],
      disableName: !this.state.disableName,
    });
  }

  onChangeInputValue(evt) {
    this.setState({
      inputName: evt.target.value,
      disableCSV: !this.state.disableCSV,
    });
  }

  canvas() {
    return document.querySelector("#imageCanvas");
  }

  ctx() {
    return this.canvas().getContext("2d");
  }

  handleImage(event) {
    const canvas = this.canvas();
    const ctx = this.ctx();
    var text_title = "Nguyễn Thị An";
    this.drawOverlayImage();
    ctx.fillStyle = "#000000";
    ctx.font = "24pt 'Arial'";
    let rect = canvas.getBoundingClientRect();
    console.log(rect);
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log("Coordinate x: " + x, "Coordinate y: " + y);
    ctx.fillText(text_title, x, y);
    this.setState({ x: x, y: y });
    var img = canvas.toDataURL("image/png");
    this.setState({ canvasImg: img });
  }

  drawOverlayImage() {
    const canvas = this.canvas();
    const ctx = this.ctx();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var img = new Image();
    img.src = this.state.file;
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = "rgba(0, 0, 200, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  resetFile(event) {
    event.preventDefault();
    this.setState({ file: null, csvFile: null, template: null });
  }

  openModal(event) {
    event.preventDefault();
    $("#blank-preview-image").hide();
    this.setState({ isOpen: true });
  }

  closeModal(event) {
    $("#blank-preview-image").hide();
    this.setState({ isOpen: false });
  }

  handleClick() {
    this.setState({
      openDownload: !this.state.openDownload,
    });
  }

  async handleSubmit() {
    const { pathname } = this.props.location;
    const formData = new FormData();

    formData.append("template", this.state.template);
    formData.append("x-coordinate", this.state.x || 50);
    formData.append("y-coordinate", this.state.y || 50);

    if (this.state.inputName === "" && this.state.csvFile != null) {
      // User input name but doesn't input csv file
      formData.append("csv", this.state.csvFile);
    } else if (this.state.inputName !== "" && this.state.csvFile == null) {
      // User input csv file but doesn't input name
      formData.append("text", this.state.inputName);
    } else if (this.state.inputName !== "" && this.state.csvFile != null) {
      // User input both csv file & input name
      alert(
        "Please input a name OR a CSV file to generate certificate NOT BOTH"
      );
    } else {
      alert("Please input a name OR a CSV file to generate certificate");
    }

    try {
      if (pathname === "/generate") {
        const response = await axios.post(pathname, formData, {
          responseType: "blob",
        });
        toast.success("Successfully Generated Certificates");
        FileDownload(response.data, "certificates.zip");
      } else {
        // TODO: Edit email fields in formData
        formData.append("email-receivers", null);
        formData.append("email-message", "");
        await axios.post(pathname, formData);
        toast.success("Successfully Generated Certificates and Sent Emails");
      }
    } catch (error) {
      toast.error("An unexpected error has occured");
    }
  }

  render() {
    const {
      inputName,
      disableName,
      disableCSV,
      file,
      canvasImg,
      isOpen,
      csvFile,
      template,
    } = this.state;
    const { pathname } = this.props.location;

    return (
      <div className="main">
        <ToastContainer />
        <div className="container-fluid h-100">
          <div className="row align-items-center h-100">
            <div className="order-2 order-md-1 col-md-6 px-5 pt-5">
              <h3 className="bold text-center">Enter a name</h3>
              <form className="form pt-3">
                <div className="input-group">
                  <input
                    value={inputName}
                    onChange={(evt) => this.onChangeInputValue(evt)}
                    id="name"
                    type="text"
                    className="form-control"
                    placeholder="name"
                    disabled={disableName ? "disabled" : ""}
                  />
                </div>
              </form>
              <div className="divider div-transparent div-dot"></div>
              <div className="d-flex justify-content-center">
                <div class="upload-btn-wrapper">
                  <button
                    className="btn"
                    disabled={disableCSV ? "disabled" : ""}
                  >
                    Upload a CSV file
                  </button>
                  <input
                    id="upload-input"
                    type="file"
                    accept=".csv"
                    name="myfile"
                    onChange={this.onCSVChange}
                    disabled={disableCSV ? "disabled" : ""}
                  />
                  <span id="fileName" className="ml-2"></span>
                </div>
              </div>
              <h5 className="text-center my-5">
                {" "}
                Don't know how to generate form?
                <Link className="link-instructions" to={"/instruction"}>
                  See our instruction
                </Link>
              </h5>
            </div>
            <div className="h-75 order-2 order-md-1 col-md-6">
              <div class="box-fileupload">
                <input
                  onChange={this.onTemplateChange}
                  type="file"
                  accept=".png"
                  id="fileId"
                  class="file-upload-input"
                  name="files"
                />
                <label for="fileId" class="file-upload-btn"></label>
                <p class="box-fileupload__lable">
                  Upload a certificate template
                </p>
              </div>
              {file && (
                <span
                  className="image-preview__delete-btn"
                  onClick={this.resetFile}
                ></span>
              )}
              <img
                id="blank-preview-image"
                className="image-preview"
                src={file}
                onClick={this.openModal}
              />
              <img
                className="image-preview"
                src={canvasImg}
                onClick={this.openModal}
              />
              <Modal centered show={isOpen} onHide={this.closeModal}>
                <canvas
                  id="imageCanvas"
                  onMouseOver={this.drawOverlayImage}
                  onClick={this.handleImage}
                ></canvas>
                <Modal.Footer>
                  <button className="btn" onClick={this.closeModal}>
                    Done
                  </button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          {
            // ***************************************
            // TODO: Render email with receivers input (name input or csv upload) field, message input field
          }
          <div></div>
          {
            // ***************************************
          }
          <div className="d-flex justify-content-end">
            <button
              className="btn"
              onClick={() => this.handleSubmit()}
              type="button"
              disabled={csvFile === null || template === null ? true : false}
            >
              {pathname === "/generate" ? "Generate" : "Send Email"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default HomePage;
