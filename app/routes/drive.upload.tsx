import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef } from "react";
import styles from "~/styles/drive.upload.css";
import type { Awesomplete } from "~/types/awesomplete";
import type { ActionData } from "./drive.upload.server";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export { action } from "./drive.upload.server";

export default function DriveUpload() {
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isUploading = navigation.state === "submitting";

  useEffect(() => {
    // Initialize Awesomplete for multiple inputs
    const multipleInputs = document.querySelectorAll("input[data-multiple]");
    multipleInputs.forEach((input) => {
      new window.Awesomplete(input as HTMLInputElement, {
        filter: function (text: string, input: string) {
          return window.Awesomplete.FILTER_CONTAINS(
            text,
            input.match(/[^,]*$/)?.[0] || ""
          );
        },
        item: function (text: string, input: string) {
          return window.Awesomplete.ITEM(
            text,
            input.match(/[^,]*$/)?.[0] || ""
          );
        },
        replace: function (this: Awesomplete, text: string) {
          const before = this.input.value.match(/^.+,\s*|/)?.[0] || "";
          this.input.value = before + text + ", ";
        },
      });
    });

    // Initialize Awesomplete for dropdown inputs
    document.querySelectorAll("input.dropdown-input").forEach((elem) => {
      const comboplete = new window.Awesomplete(elem as HTMLInputElement, {
        minChars: 0,
      });

      const dropdownToggle =
        elem.parentElement?.querySelector(".dropdown-toggle");
      if (dropdownToggle) {
        dropdownToggle.addEventListener("click", function () {
          if (comboplete.ul.childNodes.length === 0) {
            comboplete.minChars = 0;
            comboplete.evaluate();
            comboplete.input.focus();
          } else if (comboplete.ul.hasAttribute("hidden")) {
            comboplete.open();
            comboplete.input.focus();
            return;
          } else {
            comboplete.close();
          }
        });
      }
    });

    // Handle file input label
    const fileInput = document.querySelector("#docFile") as HTMLInputElement;
    if (fileInput) {
      fileInput.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const label = document.querySelector(".custom-file-label");
        if (label && target.files?.[0]) {
          label.textContent = target.files[0].name;
        }
      });
    }
  }, []);

  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        window.Swal.fire("Success!", "File uploaded successfully!", "success");
      } else {
        window.Swal.fire("Error", actionData.error, "error");
      }
    }
  }, [actionData]);

  return (
    <div>
      <nav className="navbar navbar-light bg-light mb-4">
        <a className="navbar-brand" href="/">
          Drive
        </a>
        <div>
          <a className="nav-link" href="/">
            Home
          </a>
        </div>
      </nav>

      <Form ref={formRef} method="post" encType="multipart/form-data">
        <div>
          <div className="form-group">
            <label htmlFor="visitDate">Visit Date</label>
            <input
              type="date"
              id="visitDate"
              className="form-control"
              name="visitDate"
              required
            />
          </div>
        </div>

        <div>
          <div className="form-group">
            <label htmlFor="patientName">Patient Name</label>
            <div className="input-group">
              <input
                id="patientName"
                className="form-control awesomplete dropdown-input"
                name="patientName"
                data-list="venkateshwar,saatvik,supriya,mammu,baba"
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  aria-expanded="false"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label htmlFor="ailments">Ailments</label>
            <div className="input-group">
              <input
                id="ailments"
                className="awesomplete form-control dropdown-input"
                name="ailments"
                data-list="fever,cold,cough,headache,stomachache,skin infection"
                data-multiple
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  aria-expanded="false"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label htmlFor="hospital">Hospital</label>
            <div className="input-group">
              <input
                id="hospital"
                className="awesomplete form-control dropdown-input"
                name="hospital"
                data-list="Safekids,Fernandez,Ankura,Butterfly,Dr Manmohan"
                data-multiple
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  aria-expanded="false"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label htmlFor="docFile">Upload File</label>
            <div className="input-group">
              <div className="custom-file">
                <input
                  type="file"
                  id="docFile"
                  className="custom-file-input"
                  aria-describedby="inputGroupFileAddon01"
                  name="docFile"
                  accept=".pdf,image/*"
                  required
                />
                <label className="custom-file-label" htmlFor="docFile">
                  Choose file
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="form-group">
            <label htmlFor="fileType">File type</label>
            <div className="input-group">
              <input
                id="fileType"
                className="awesomplete form-control dropdown-input"
                name="fileType"
                data-list="prescription,bill,report"
                data-multiple
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  aria-expanded="false"
                ></button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </Form>

      {isUploading && (
        <div className="custom-fade">
          <div className="loader"></div>
        </div>
      )}

      <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
      <script src="https://cdn.jsdelivr.net/npm/awesomplete@1.1.5/awesomplete.min.js"></script>
    </div>
  );
}
