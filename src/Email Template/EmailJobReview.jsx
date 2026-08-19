import React from "react";

export default function EmailJobReview({data}) {
  console.log("Data to mail",data)
  const jobReviewhtml = `<!DOCTYPE html>
<html
  lang="en"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  xmlns:v="urn:schemas-microsoft-com:vml"
>
  <head>
    <title>Job Review</title>
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <!-- google font link -->
    <link
      href="https://fonts.googleapis.com/css?family=Cabin"
      rel="stylesheet"
      type="text/css"
    />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Droid+Serif"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Lato"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Oxygen"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Oswald"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Ubuntu"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Roboto"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Nunito"
      rel="stylesheet"
      type="text/css"
    />
    <!-- icon font-awesome -->
    <script
      src="https://kit.fontawesome.com/823adb53b6.js"
      crossorigin="anonymous"
    ></script>
    <!-- end -->
  </head>
  <body
    style="
      background-color: #f2f2f2;
      margin: 0;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      border="0"
      cellpadding="0"
      cellspacing="0"
      class="nl-container"
      role="presentation"
      style="
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        background-color: #f2f2f2;
      "
      width="100%"
    >
      <tbody>
        <tr>
          <td>
            <!-- Top Header Space -->
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-1"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 7px;
                              padding-bottom: 5px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <div
                              class="spacer_block"
                              style="
                                height: 15px;
                                line-height: 15px;
                                font-size: 1px;
                              "
                            ></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- Header Name and Company Logo -->
            <!-- start -->
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-3"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        background-color: #fbfbfb;
                        color: #000000;
                        width: 680px;
                        margin-bottom: 7px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              vertical-align: middle;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="83.3%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <!-- top left side text -->
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    text-align: center;
                                    
                                  "
                                >
                                  <h2
                                    style="
                                      margin: 0;
                                      color: black;
                                      font-size: 1rem;
                                      font-family: Cabin, Arial, Helvetica Neue,
                                        Helvetica, sans-serif;
                                      text-align: left;
                                      font-weight: 600;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <strong>Operations360</strong>
                                  </h2>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-2"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="16.666666666666668%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <!-- GW logo -->
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      class="gw-logo"
                                      src="https://raw.githubusercontent.com/pranab-greenwave/pranab-greenwave/main/logo.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 25% ;
                                      "
                                      width="50"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- end -->
            <!-- column 2 btn, text & Image -->
            <!-- start column 2  -->
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-5"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        background-color: #fbfbfb;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <!-- col 2 left side text -->
                      <tbody>
                        <tr class="reverse">
                          <td
                            class="column column-1 first"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-left: 25px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                              vertical-align: middle;
                            "
                            width="50%"
                          >
                            <div class="border">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="heading_block block-3"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 5px;
                                      padding-right: 5px;
                                      padding-top: 5px;
                                      text-align: center;
                                      width: 100%;
                                    "
                                  >
                                    <h1
                                      style="
                                        margin: 0;
                                        color: #2f2e41;
                                        direction: ltr;
                                        font-family: 'Cabin', Arial,
                                          'Helvetica Neue', Helvetica,
                                          sans-serif;
                                        font-size: 1rem;
                                        font-weight: 400;
                                        letter-spacing: 1px;
                                        line-height: 120%;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                      "
                                    >
                                      <strong class="main-text">Job Review</strong>
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-4"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 10px;
                                      padding-left: 5px;
                                      padding-right: 5px;
                                      padding-top: 10px;
                                    "
                                  >
                                    <div
                                      style="
                                        color: #5f6166;
                                        direction: ltr;
                                        font-family: Cabin, Arial,
                                          Helvetica Neue, Helvetica, sans-serif;
                                        font-size: 15px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        mso-line-height-alt: 22.5px;
                                        text-align: justify;
                                      "
                                    >
                                      <p style="margin: 0">
                                        "You have a Job to Review"
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="paragraph_block block-4"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 5px;
                                      padding-left: 5px;
                                      padding-right: 5px;
                                      padding-top: 0px;
                                    "
                                  >
                                    <div
                                      style="
                                        color: #5f6166;
                                        direction: ltr;
                                        font-family: Cabin, Arial,
                                          Helvetica Neue, Helvetica, sans-serif;
                                        font-size: 15px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        mso-line-height-alt: 22.5px;
                                        text-align: justify;
                                        
                                      "
                                    >
                                      <p style="margin: 0;
                                            width: fit-content;
                                            background: #e4e3f4;
                                            padding: 5px;
                                            border-radius: 10px;
                                            font-size: 0.7rem;
                                            color: black;">
                                          ${data.approver}
                                            </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="button_block block-5"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  padding-top: 5px;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td class="pad" style="text-align: left">
                                    <div align="left" class="alignment">
                                      <div>
                                        <a
                                          href=${process.env.REACT_APP_HOME+"/workflow/jobreviewer"}
                                          target="_blank"
                                          class="btn" 
                                          >Click Me
                                        </a>
                                        <!-- btn css  -->
                                        <style>
                                          .btn {
                                            text-decoration: none;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            color: #ffffff;
                                            font-size: 0.7rem;
                                            border-style: solid;
                                            border-color: #000f26;
                                            border-width: 0.45rem 1.5rem 0.45rem
                                              1.5rem;
                                            display: inline-block;
                                            background: #000f26;
                                            border-radius: 5px;
                                            font-family: Montserrat,
                                              "Google Sans", "Segoe UI", Roboto,
                                              Arial, Ubuntu, sans-serif;
                                            font-weight: bold;
                                            font-style: normal;
                                            width: auto;
                                            text-align: center;
                                          }
                                        </style>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                          <td
                            class="column column-2 last"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="50%"
                          >
                            <div class="border">
                              <table
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                class="image_block block-2"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                                width="100%"
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 25px;
                                      padding-left: 20px;
                                      padding-right: 20px;
                                      padding-top: 20px;
                                      width: 100%;
                                    "
                                  >
                                    <div
                                      align="center"
                                      class="alignment"
                                      style="line-height: 10px"
                                    >
                                      <img
                                        alt="Review"
                                        class="fullMobileWidth"
                                        src="https://img.freepik.com/free-vector/man-having-online-job-interview_52683-43379.jpg"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 165px;
                                          max-width: 100%;
                                        "
                                        title="Review"
                                        width="300"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- End column 2 -->
            
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-7"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 0px;
                              padding-bottom: 0px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <div
                              class="spacer_block"
                              style="
                                height: 15px;
                                line-height: 20px;
                                font-size: 1px;
                              "
                            >
                               
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-8"
              role="presentation"
              style="
                mso-table-lspace: 0pt;
                mso-table-rspace: 0pt;
                background-size: auto;
              "
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        background-color: #fbfbfb;
                        color: #000000;
                        background-size: auto;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              border-bottom: 0px solid #ffffff;
                              border-left: 0px solid #ffffff;
                              border-right: 0px solid #ffffff;
                              border-top: 0px solid #ffffff;
                              padding-left: 25px;
                              padding-right: 25px;
                              vertical-align: top;
                              padding-top: 20px;
                              padding-bottom: 15px;
                            "
                            width="100%"
                          >
                            <table
                              border="0"
                              cellpadding="5"
                              cellspacing="0"
                              class="heading_block block-1"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td class="pad">
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #2f2e41;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 1rem;
                                      font-weight: 400;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: left;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <strong>Job Details</strong>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-9"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        background-color: #fbfbfb;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt="JobId"
                                      src="https://cdn-icons-png.flaticon.com/512/4962/4962095.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 60px;
                                        max-width: 100%;
                                      "
                                      title="JobId"
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      text-align: center;
                                      margin-top: 0px;
                                      margin-bottom: 0;
                                    "
                                  >
                                    Job Id
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 5px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder"
                                      >${data.jobID}</span
                                    >
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-2"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt="Benefit"
                                      src="https://cdn-icons-png.flaticon.com/512/4961/4961879.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 60px;
                                        max-width: 100%;
                                      "
                                      title="Benefit"
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    Job Name
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder"
                                      >${data.jobName}</span
                                    >
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-3"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      src="https://cdn-icons-png.flaticon.com/512/4205/4205621.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 60px;
                                        max-width: 100%;
                                      "
                                      title="Benefit"
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    Schedule Start Time vs Stop Time
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder"
                                      >${data.scheduledJobStartTime}
                                    </span>
                                    <span class="tinyMce-placeholder"
                                      >${data.scheduledJobEndTime}
                                    </span>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>

                          <td
                            class="column column-4"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-left: 20px;
                              padding-right: 20px;
                              vertical-align: top;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="25%"
                          >
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="image_block block-2"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                    padding-top: 5px;
                                  "
                                >
                                  <div
                                    align="center"
                                    class="alignment"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      alt=""
                                      src="https://cdn-icons-png.flaticon.com/512/4205/4205655.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 60px;
                                        max-width: 100%;
                                      "
                                      title="Benefit"
                                      width="130"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-3"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-top: 10px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #979faf;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    Actual Start Time vs Stop Time
                                  </h1>
                                </td>
                              </tr>
                            </table>
                            <table
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              class="heading_block block-4"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                              width="100%"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    text-align: center;
                                    width: 100%;
                                  "
                                >
                                  <h1
                                    style="
                                      margin: 0;
                                      color: #7f848f;
                                      direction: ltr;
                                      font-family: 'Cabin', Arial,
                                        'Helvetica Neue', Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: 1px;
                                      line-height: 120%;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                    "
                                  >
                                    <span class="tinyMce-placeholder">
                                      ${data.actualJobStartTime}
                                    </span>
                                    <span class="tinyMce-placeholder">
                                      ${data.actualJobEndTime}
                                    </span>
                                  </h1>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-10"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 0px;
                              padding-bottom: 0px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            <div
                              class="spacer_block"
                              style="
                                height: 15px;
                                line-height: 20px;
                                font-size: 1px;
                              "
                            >
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <table
              align="center"
              border="0"
              cellpadding="0"
              cellspacing="0"
              class="row row-12"
              role="presentation"
              style="mso-table-lspace: 0pt; mso-table-rspace: 0pt"
              width="100%"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      class="row-content stack"
                      role="presentation"
                      style="
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                        color: #000000;
                        width: 680px;
                      "
                      width="680"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              padding-top: 5px;
                              padding-bottom: 5px;
                              border-top: 0px;
                              border-right: 0px;
                              border-bottom: 0px;
                              border-left: 0px;
                            "
                            width="100%"
                          >
                            
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
        <!-- css style -->
        <style>
          * {
            box-sizing: border-box;
          }
    
          body {
            margin: 0;
            padding: 0;
          }
    
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
          }
    
          p {
            line-height: inherit;
          }
    
          .desktop_hide,
          .desktop_hide table {
            mso-hide: all;
            display: none;
            max-height: 0px;
            overflow: hidden;
          }
          /* for mobile view */
          @media (max-width: 700px) {
            .fullMobileWidth,
            .row-content {
              width: 100% !important;
            }
            .fullMobileWidth{
              width: 50% !important;
            }
            .main-text{
              font-size:  1.5rem;
            }
            .mobile_hide {
              display: none;
            }
            .pad{
              padding: 0.45rem !important;
            }
            .stack .column {
              width: 100%;
              display: block;
            }
    
            .mobile_hide {
              min-height: 0;
              max-height: 0;
              max-width: 0;
              overflow: hidden;
              font-size: 0px;
            }
    
            .desktop_hide,
            .desktop_hide table {
              display: table !important;
              max-height: none !important;
            }
    
            .reverse {
              display: table;
              width: 100%;
            }
    
            .reverse .column.first {
              display: block !important;
              padding: 0.5rem !important;
            }
            .gw-logo{
              width: 20% !important;
            }
    
            .reverse .column.last {
              display: table-header-group !important;
            }
    
            .row-5 td.column.first > table {
              padding-left: 25px;
              padding-right: 0;
            }
    
            .row-5 td.column.first .border,
            .row-5 td.column.last .border {
              border-top: 0;
              border-right: 0px;
              border-bottom: 0;
              border-left: 0;
            }
    
            .row-5 td.column.last > table {
              padding-left: 0;
              padding-right: 0;
            }
          }
        </style>
  </body>
</html>
  `;
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: jobReviewhtml }} />
    </>
  );
}
