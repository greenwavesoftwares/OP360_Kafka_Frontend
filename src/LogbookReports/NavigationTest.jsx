import React, { useState } from "react";

function NavigationTest() {
  //   const myList = ["one", "two", "three", "four", "five"];
  const myList = [
    {
      transactionId: "T20231208150052486",
      jobId: "AJ20231208145900244",
      activityId: "AA20231208145900745",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "fail",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "fasdrfwer",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "pass",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "rqwer",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "werwe",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "pass",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "asdfwertf",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "fail",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "fasdf",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "pass",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B01",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "sdafasdf",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "fasdrfsd",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1151",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "sdfsadfsa",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "asdfsadf",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_5: {
          value: "sadgfasdgfasdfgasdf",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "fersdfsadfasdfwer",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "pass",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "asdfsdfdfsdfsadf",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "fail",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "dgasdgsadgsad",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "sadfsdafasdfsad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "pass",
          remarks: "NA",
        },
        _5_1: {
          value: "84443",
          remarks: "NA",
        },
        _23_5: {
          value: "sadfsda",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2089",
          remarks: "NA",
        },
        _23_4: {
          value: "pass",
          remarks: "NA",
        },
        _27_5: {
          value: "rwer",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "edrtfsdsdf",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "sdfasdf",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "gsfsad",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "fail",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-08T09:31:06.130+00:00",
      userRemarks:
        "You have entered fail in cell id_20_4\r\nYou have entered fasdrfwer in cell id_20_5\r\nYou have entered pass in cell id_8_4\r\nYou have entered rqwer in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered fasdfasd in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered werwe in cell id_28_5\r\nYou have entered pass in cell id_12_4\r\nYou have entered asdfwertf in cell id_12_5\r\nYou have entered fail in cell id_16_4\r\nYou have entered fasdf in cell id_16_5\r\nYou have entered pass in cell id_21_4\r\nYou have entered B01 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered sdafasdf in cell id_21_5\r\nYou have entered fasdrfsd in cell id_25_5\r\nYou have entered 1151 in cell id_3_1\r\nYou have entered sdfsadfsa in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered asdfsadf in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered pass in cell id_22_4\r\nYou have entered sadgfasdgfasdfgasdf in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered fersdfsadfasdfwer in cell id_26_5\r\nYou have entered pass in cell id_10_4\r\nYou have entered asdfsdfdfsdfsadf in cell id_10_5\r\nYou have entered fail in cell id_14_4\r\nYou have entered dgasdgsadgsad in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered sadfsdafasdfsad in cell id_18_5\r\nYou have entered pass in cell id_9_4\r\nYou have entered 84443 in cell id_5_1\r\nYou have entered sadfsda in cell id_23_5\r\nYou have entered T2089 in cell id_5_4\r\nYou have entered pass in cell id_23_4\r\nYou have entered rwer in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered edrtfsdsdf in cell id_9_5\r\nYou have entered sdfasdf in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered gsfsad in cell id_15_5\r\nYou have entered fail in cell id_15_4\r\nYou have entered fasdfasd in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20231208151411981",
      jobId: "AJ20231208151343773",
      activityId: "AA20231208151344273",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "fail",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "fasdrfwer",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "pass",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "rqwer",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "werwe",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "pass",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "asdfwertf",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "fail",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "fasdf",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "pass",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B02",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "sdafasdf",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "fasdrfsd",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1152",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "sdfsadfsa",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "asdfsadf",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_5: {
          value: "sadgfasdgfasdfgasdf",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "fersdfsadfasdfwer",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "pass",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "asdfsdfdfsdfsadf",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "fail",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "dgasdgsadgsad",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "sadfsdafasdfsad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "pass",
          remarks: "NA",
        },
        _5_1: {
          value: "85701",
          remarks: "NA",
        },
        _23_5: {
          value: "sadfsda",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2191",
          remarks: "NA",
        },
        _23_4: {
          value: "pass",
          remarks: "NA",
        },
        _27_5: {
          value: "rwer",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "edrtfsdsdf",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "sdfasdf",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "gsfsad",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "fail",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-08T09:44:20.220+00:00",
      userRemarks:
        "You have entered fail in cell id_20_4\r\nYou have entered fasdrfwer in cell id_20_5\r\nYou have entered pass in cell id_8_4\r\nYou have entered rqwer in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered fasdfasd in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered werwe in cell id_28_5\r\nYou have entered pass in cell id_12_4\r\nYou have entered asdfwertf in cell id_12_5\r\nYou have entered fail in cell id_16_4\r\nYou have entered fasdf in cell id_16_5\r\nYou have entered pass in cell id_21_4\r\nYou have entered B02 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered sdafasdf in cell id_21_5\r\nYou have entered fasdrfsd in cell id_25_5\r\nYou have entered 1152 in cell id_3_1\r\nYou have entered sdfsadfsa in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered asdfsadf in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered pass in cell id_22_4\r\nYou have entered sadgfasdgfasdfgasdf in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered fersdfsadfasdfwer in cell id_26_5\r\nYou have entered pass in cell id_10_4\r\nYou have entered asdfsdfdfsdfsadf in cell id_10_5\r\nYou have entered fail in cell id_14_4\r\nYou have entered dgasdgsadgsad in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered sadfsdafasdfsad in cell id_18_5\r\nYou have entered pass in cell id_9_4\r\nYou have entered 85701 in cell id_5_1\r\nYou have entered sadfsda in cell id_23_5\r\nYou have entered T2191 in cell id_5_4\r\nYou have entered pass in cell id_23_4\r\nYou have entered rwer in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered edrtfsdsdf in cell id_9_5\r\nYou have entered sdfasdf in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered gsfsad in cell id_15_5\r\nYou have entered fail in cell id_15_4\r\nYou have entered fasdfasd in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20231208151830697",
      jobId: "AJ20231208151808363",
      activityId: "AA20231208151808864",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "fail",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "fasdrfwer",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "pass",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "rqwer",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "werwe",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "pass",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "asdfwertf",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "fail",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "fasdf",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "pass",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B03",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "sdafasdf",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "fasdrfsd",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1153",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "sdfsadfsa",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "asdfsadf",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_5: {
          value: "sadgfasdgfasdfgasdf",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "fersdfsadfasdfwer",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "pass",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "asdfsdfdfsdfsadf",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "fail",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "dgasdgsadgsad",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "sadfsdafasdfsad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "pass",
          remarks: "NA",
        },
        _5_1: {
          value: "86657",
          remarks: "NA",
        },
        _23_5: {
          value: "sadfsda",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2697",
          remarks: "NA",
        },
        _23_4: {
          value: "pass",
          remarks: "NA",
        },
        _27_5: {
          value: "rwer",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "edrtfsdsdf",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "sdfasdf",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "gsfsad",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "fail",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-08T09:48:34.113+00:00",
      userRemarks:
        "You have entered fail in cell id_20_4\r\nYou have entered fasdrfwer in cell id_20_5\r\nYou have entered pass in cell id_8_4\r\nYou have entered rqwer in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered fasdfasd in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered werwe in cell id_28_5\r\nYou have entered pass in cell id_12_4\r\nYou have entered asdfwertf in cell id_12_5\r\nYou have entered fail in cell id_16_4\r\nYou have entered fasdf in cell id_16_5\r\nYou have entered pass in cell id_21_4\r\nYou have entered B03 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered sdafasdf in cell id_21_5\r\nYou have entered fasdrfsd in cell id_25_5\r\nYou have entered 1153 in cell id_3_1\r\nYou have entered sdfsadfsa in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered asdfsadf in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered pass in cell id_22_4\r\nYou have entered sadgfasdgfasdfgasdf in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered fersdfsadfasdfwer in cell id_26_5\r\nYou have entered pass in cell id_10_4\r\nYou have entered asdfsdfdfsdfsadf in cell id_10_5\r\nYou have entered fail in cell id_14_4\r\nYou have entered dgasdgsadgsad in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered sadfsdafasdfsad in cell id_18_5\r\nYou have entered pass in cell id_9_4\r\nYou have entered 86657 in cell id_5_1\r\nYou have entered sadfsda in cell id_23_5\r\nYou have entered T2697 in cell id_5_4\r\nYou have entered pass in cell id_23_4\r\nYou have entered rwer in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered edrtfsdsdf in cell id_9_5\r\nYou have entered sdfasdf in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered gsfsad in cell id_15_5\r\nYou have entered fail in cell id_15_4\r\nYou have entered fasdfasd in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20231208160012885",
      jobId: "AJ20231208155943562",
      activityId: "AA20231208155944063",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "fail",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "fasdrfwer",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "pass",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "rqwer",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "werwe",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "pass",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "asdfwertf",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "fail",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "fasdf",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "pass",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B01",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "sdafasdf",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "fasdrfsd",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1151",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "sdfsadfsa",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "asdfsadf",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_5: {
          value: "sadgfasdgfasdfgasdf",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "fersdfsadfasdfwer",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "pass",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "asdfsdfdfsdfsadf",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "fail",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "dgasdgsadgsad",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "sadfsdafasdfsad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "pass",
          remarks: "NA",
        },
        _5_1: {
          value: "84443",
          remarks: "NA",
        },
        _23_5: {
          value: "sadfsda",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2089",
          remarks: "NA",
        },
        _23_4: {
          value: "pass",
          remarks: "NA",
        },
        _27_5: {
          value: "rwer",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "edrtfsdsdf",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "sdfasdf",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "gsfsad",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "fail",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-08T10:30:16.027+00:00",
      userRemarks:
        "You have entered fail in cell id_20_4\r\nYou have entered fasdrfwer in cell id_20_5\r\nYou have entered pass in cell id_8_4\r\nYou have entered rqwer in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered fasdfasd in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered werwe in cell id_28_5\r\nYou have entered pass in cell id_12_4\r\nYou have entered asdfwertf in cell id_12_5\r\nYou have entered fail in cell id_16_4\r\nYou have entered fasdf in cell id_16_5\r\nYou have entered pass in cell id_21_4\r\nYou have entered B01 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered sdafasdf in cell id_21_5\r\nYou have entered fasdrfsd in cell id_25_5\r\nYou have entered 1151 in cell id_3_1\r\nYou have entered sdfsadfsa in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered asdfsadf in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered pass in cell id_22_4\r\nYou have entered sadgfasdgfasdfgasdf in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered fersdfsadfasdfwer in cell id_26_5\r\nYou have entered pass in cell id_10_4\r\nYou have entered asdfsdfdfsdfsadf in cell id_10_5\r\nYou have entered fail in cell id_14_4\r\nYou have entered dgasdgsadgsad in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered sadfsdafasdfsad in cell id_18_5\r\nYou have entered pass in cell id_9_4\r\nYou have entered 84443 in cell id_5_1\r\nYou have entered sadfsda in cell id_23_5\r\nYou have entered T2089 in cell id_5_4\r\nYou have entered pass in cell id_23_4\r\nYou have entered rwer in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered edrtfsdsdf in cell id_9_5\r\nYou have entered sdfasdf in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered gsfsad in cell id_15_5\r\nYou have entered fail in cell id_15_4\r\nYou have entered fasdfasd in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20231208160649290",
      jobId: "AJ20231208160632547",
      activityId: "AA20231208160633049",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "fail",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "fasdrfwer",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "pass",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "rqwer",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "werwe",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "pass",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "asdfwertf",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "fail",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "fasdf",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "pass",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B03",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "sdafasdf",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "fasdrfsd",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1153",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "sdfsadfsa",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "asdfsadf",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_5: {
          value: "sadgfasdgfasdfgasdf",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "fersdfsadfasdfwer",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "pass",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "asdfsdfdfsdfsadf",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "fail",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "dgasdgsadgsad",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "sadfsdafasdfsad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "pass",
          remarks: "NA",
        },
        _5_1: {
          value: "86657",
          remarks: "NA",
        },
        _23_5: {
          value: "sadfsda",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2697",
          remarks: "NA",
        },
        _23_4: {
          value: "pass",
          remarks: "NA",
        },
        _27_5: {
          value: "rwer",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "edrtfsdsdf",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "sdfasdf",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "gsfsad",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "fail",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-08T10:36:53.330+00:00",
      userRemarks:
        "You have entered fail in cell id_20_4\r\nYou have entered fasdrfwer in cell id_20_5\r\nYou have entered pass in cell id_8_4\r\nYou have entered rqwer in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered fasdfasd in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered werwe in cell id_28_5\r\nYou have entered pass in cell id_12_4\r\nYou have entered asdfwertf in cell id_12_5\r\nYou have entered fail in cell id_16_4\r\nYou have entered fasdf in cell id_16_5\r\nYou have entered pass in cell id_21_4\r\nYou have entered B03 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered sdafasdf in cell id_21_5\r\nYou have entered fasdrfsd in cell id_25_5\r\nYou have entered 1153 in cell id_3_1\r\nYou have entered sdfsadfsa in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered asdfsadf in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered pass in cell id_22_4\r\nYou have entered sadgfasdgfasdfgasdf in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered fersdfsadfasdfwer in cell id_26_5\r\nYou have entered pass in cell id_10_4\r\nYou have entered asdfsdfdfsdfsadf in cell id_10_5\r\nYou have entered fail in cell id_14_4\r\nYou have entered dgasdgsadgsad in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered sadfsdafasdfsad in cell id_18_5\r\nYou have entered pass in cell id_9_4\r\nYou have entered 86657 in cell id_5_1\r\nYou have entered sadfsda in cell id_23_5\r\nYou have entered T2697 in cell id_5_4\r\nYou have entered pass in cell id_23_4\r\nYou have entered rwer in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered edrtfsdsdf in cell id_9_5\r\nYou have entered sdfasdf in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered gsfsad in cell id_15_5\r\nYou have entered fail in cell id_15_4\r\nYou have entered fasdfasd in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20231208161544520",
      jobId: "AJ20231208161534221",
      activityId: "AA20231208161534721",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "fail",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "fasdrfwer",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "pass",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "rqwer",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "werwe",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "pass",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "asdfwertf",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "fail",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "fasdf",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "pass",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B02",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "sdafasdf",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "fasdrfsd",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1152",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "sdfsadfsa",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "asdfsadf",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_5: {
          value: "sadgfasdgfasdfgasdf",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "fersdfsadfasdfwer",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "pass",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "asdfsdfdfsdfsadf",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "fail",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "dgasdgsadgsad",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "sadfsdafasdfsad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "pass",
          remarks: "NA",
        },
        _5_1: {
          value: "85701",
          remarks: "NA",
        },
        _23_5: {
          value: "sadfsda",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2191",
          remarks: "NA",
        },
        _23_4: {
          value: "pass",
          remarks: "NA",
        },
        _27_5: {
          value: "rwer",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "edrtfsdsdf",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "sdfasdf",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "gsfsad",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "fail",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "fasdfasd",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-08T10:45:47.657+00:00",
      userRemarks:
        "You have entered fail in cell id_20_4\r\nYou have entered fasdrfwer in cell id_20_5\r\nYou have entered pass in cell id_8_4\r\nYou have entered rqwer in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered fasdfasd in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered werwe in cell id_28_5\r\nYou have entered pass in cell id_12_4\r\nYou have entered asdfwertf in cell id_12_5\r\nYou have entered fail in cell id_16_4\r\nYou have entered fasdf in cell id_16_5\r\nYou have entered pass in cell id_21_4\r\nYou have entered B02 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered sdafasdf in cell id_21_5\r\nYou have entered fasdrfsd in cell id_25_5\r\nYou have entered 1152 in cell id_3_1\r\nYou have entered sdfsadfsa in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered asdfsadf in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered pass in cell id_22_4\r\nYou have entered sadgfasdgfasdfgasdf in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered fersdfsadfasdfwer in cell id_26_5\r\nYou have entered pass in cell id_10_4\r\nYou have entered asdfsdfdfsdfsadf in cell id_10_5\r\nYou have entered fail in cell id_14_4\r\nYou have entered dgasdgsadgsad in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered sadfsdafasdfsad in cell id_18_5\r\nYou have entered pass in cell id_9_4\r\nYou have entered 85701 in cell id_5_1\r\nYou have entered sadfsda in cell id_23_5\r\nYou have entered T2191 in cell id_5_4\r\nYou have entered pass in cell id_23_4\r\nYou have entered rwer in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered edrtfsdsdf in cell id_9_5\r\nYou have entered sdfasdf in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered gsfsad in cell id_15_5\r\nYou have entered fail in cell id_15_4\r\nYou have entered fasdfasd in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20231214151056810",
      jobId: "AJ20231214151036124",
      activityId: "AA20231214151036624",
      formName: "72053 Vivel BW Mint Cucumber",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          value: "pass",
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          value: "good",
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "fail",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          value: "bad",
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          value: "pass",
          remarks: "NA",
        },
        _24_5: {
          value: "good",
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "fail",
          remarks: "NA",
        },
        _28_5: {
          value: "bad",
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          value: "fail",
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          value: "bad",
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          value: "pass",
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          value: "good",
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          value: "fail",
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          value: "B01",
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          value: "pass",
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          value: "bad",
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          value: "good",
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          value: "1151",
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          value: "bad",
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          value: "fail",
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          value: "good",
          remarks: "NA",
        },
        _17_4: {
          value: "pass",
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "fail",
          remarks: "NA",
        },
        _22_5: {
          value: "bad",
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          value: "fail",
          remarks: "NA",
        },
        _26_5: {
          value: "bad",
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          value: "fail",
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          value: "bad",
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          value: "pass",
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          value: "good",
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          value: "fail",
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          value: "bad",
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          value: "fail",
          remarks: "NA",
        },
        _5_1: {
          value: "84443",
          remarks: "NA",
        },
        _23_5: {
          value: "bad",
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          value: "T2089",
          remarks: "NA",
        },
        _23_4: {
          value: "fail",
          remarks: "NA",
        },
        _27_5: {
          value: "bad",
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          value: "fail",
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          value: "bad",
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          value: "good",
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          value: "pass",
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          value: "good",
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          value: "pass",
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          value: "bad",
          remarks: "NA",
        },
        _19_4: {
          value: "fail",
          remarks: "NA",
        },
      },
      userId: "ashok.singh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2023-12-14T09:40:59.463+00:00",
      userRemarks:
        "You have entered pass in cell id_20_4\r\nYou have entered good in cell id_20_5\r\nYou have entered fail in cell id_8_4\r\nYou have entered bad in cell id_8_5\r\nYou have entered pass in cell id_24_4\r\nYou have entered good in cell id_24_5\r\nYou have entered fail in cell id_28_4\r\nYou have entered bad in cell id_28_5\r\nYou have entered fail in cell id_12_4\r\nYou have entered bad in cell id_12_5\r\nYou have entered pass in cell id_16_4\r\nYou have entered good in cell id_16_5\r\nYou have entered fail in cell id_21_4\r\nYou have entered B01 in cell id_3_3\r\nYou have entered pass in cell id_25_4\r\nYou have entered bad in cell id_21_5\r\nYou have entered good in cell id_25_5\r\nYou have entered 1151 in cell id_3_1\r\nYou have entered bad in cell id_13_5\r\nYou have entered fail in cell id_13_4\r\nYou have entered good in cell id_17_5\r\nYou have entered pass in cell id_17_4\r\nYou have entered fail in cell id_22_4\r\nYou have entered bad in cell id_22_5\r\nYou have entered fail in cell id_26_4\r\nYou have entered bad in cell id_26_5\r\nYou have entered fail in cell id_10_4\r\nYou have entered bad in cell id_10_5\r\nYou have entered pass in cell id_14_4\r\nYou have entered good in cell id_14_5\r\nYou have entered fail in cell id_18_4\r\nYou have entered bad in cell id_18_5\r\nYou have entered fail in cell id_9_4\r\nYou have entered 84443 in cell id_5_1\r\nYou have entered bad in cell id_23_5\r\nYou have entered T2089 in cell id_5_4\r\nYou have entered fail in cell id_23_4\r\nYou have entered bad in cell id_27_5\r\nYou have entered fail in cell id_27_4\r\nYou have entered bad in cell id_9_5\r\nYou have entered good in cell id_11_5\r\nYou have entered pass in cell id_11_4\r\nYou have entered good in cell id_15_5\r\nYou have entered pass in cell id_15_4\r\nYou have entered bad in cell id_19_5\r\nYou have entered fail in cell id_19_4\r\n",
    },
    {
      transactionId: "T20240408123515021",
      jobId: "J20240408123203395",
      activityId: "A202404081213531353",
      formName: "72053 Vivel BW Mint Cucumber ",
      formversion: 1,
      logbookData: {
        _8_2: {
          remarks: "NA",
        },
        _20_4: {
          remarks: "NA",
        },
        _4_4: {
          remarks: "NA",
        },
        _8_3: {
          remarks: "NA",
        },
        _20_5: {
          remarks: "NA",
        },
        _24_1: {
          remarks: "NA",
        },
        _4_3: {
          remarks: "NA",
        },
        _8_4: {
          value: "GOOD",
          remarks: "NA",
        },
        _20_2: {
          remarks: "NA",
        },
        _4_2: {
          remarks: "NA",
        },
        _8_5: {
          remarks: "NA",
        },
        _20_3: {
          remarks: "NA",
        },
        _24_4: {
          remarks: "NA",
        },
        _24_5: {
          remarks: "NA",
        },
        _28_1: {
          remarks: "NA",
        },
        _24_2: {
          remarks: "NA",
        },
        _8_1: {
          remarks: "NA",
        },
        _24_3: {
          remarks: "NA",
        },
        _28_4: {
          value: "NOT ok",
          remarks: "Reason",
        },
        _28_5: {
          remarks: "NA",
        },
        _28_2: {
          remarks: "NA",
        },
        _28_3: {
          remarks: "NA",
        },
        _4_1: {
          remarks: "NA",
        },
        _20_1: {
          remarks: "NA",
        },
        _12_2: {
          remarks: "NA",
        },
        _12_1: {
          remarks: "NA",
        },
        _12_4: {
          remarks: "NA",
        },
        _12_3: {
          remarks: "NA",
        },
        _16_2: {
          remarks: "NA",
        },
        _12_5: {
          remarks: "NA",
        },
        _16_1: {
          remarks: "NA",
        },
        _16_4: {
          remarks: "NA",
        },
        _16_3: {
          remarks: "NA",
        },
        _16_5: {
          remarks: "NA",
        },
        _7_3: {
          remarks: "NA",
        },
        _21_3: {
          remarks: "NA",
        },
        _7_4: {
          remarks: "NA",
        },
        _21_4: {
          remarks: "NA",
        },
        _3_4: {
          remarks: "NA",
        },
        _7_5: {
          remarks: "NA",
        },
        _21_1: {
          remarks: "NA",
        },
        _3_3: {
          remarks: "NA",
        },
        _21_2: {
          remarks: "NA",
        },
        _25_3: {
          remarks: "NA",
        },
        _25_4: {
          remarks: "NA",
        },
        _7_1: {
          remarks: "NA",
        },
        _21_5: {
          remarks: "NA",
        },
        _25_1: {
          remarks: "NA",
        },
        _7_2: {
          remarks: "NA",
        },
        _25_2: {
          remarks: "NA",
        },
        _25_5: {
          remarks: "NA",
        },
        _3_2: {
          remarks: "NA",
        },
        _3_1: {
          remarks: "NA",
        },
        _13_1: {
          remarks: "NA",
        },
        _13_3: {
          remarks: "NA",
        },
        _13_2: {
          remarks: "NA",
        },
        _13_5: {
          remarks: "NA",
        },
        _17_1: {
          remarks: "NA",
        },
        _13_4: {
          remarks: "NA",
        },
        _17_3: {
          remarks: "NA",
        },
        _17_2: {
          remarks: "NA",
        },
        _17_5: {
          remarks: "NA",
        },
        _17_4: {
          remarks: "NA",
        },
        _22_2: {
          remarks: "NA",
        },
        _22_3: {
          remarks: "NA",
        },
        _2_4: {
          remarks: "NA",
        },
        _22_1: {
          remarks: "NA",
        },
        _26_2: {
          remarks: "NA",
        },
        _6_1: {
          remarks: "NA",
        },
        _26_3: {
          remarks: "NA",
        },
        _22_4: {
          value: "Transparent",
          remarks: "NA",
        },
        _22_5: {
          remarks: "NA",
        },
        _26_1: {
          remarks: "NA",
        },
        _26_4: {
          remarks: "NA",
        },
        _26_5: {
          remarks: "NA",
        },
        _2_3: {
          remarks: "NA",
        },
        _2_2: {
          remarks: "NA",
        },
        _2_1: {
          remarks: "NA",
        },
        _10_2: {
          remarks: "NA",
        },
        _10_1: {
          remarks: "NA",
        },
        _10_4: {
          remarks: "NA",
        },
        _10_3: {
          remarks: "NA",
        },
        _14_2: {
          remarks: "NA",
        },
        _10_5: {
          remarks: "NA",
        },
        _14_1: {
          remarks: "NA",
        },
        _14_4: {
          remarks: "NA",
        },
        _14_3: {
          remarks: "NA",
        },
        _18_2: {
          remarks: "NA",
        },
        _14_5: {
          remarks: "NA",
        },
        _18_1: {
          remarks: "NA",
        },
        _18_4: {
          remarks: "NA",
        },
        _18_3: {
          remarks: "NA",
        },
        _18_5: {
          remarks: "NA",
        },
        _9_1: {
          remarks: "NA",
        },
        _23_1: {
          remarks: "NA",
        },
        _9_2: {
          remarks: "NA",
        },
        _23_2: {
          remarks: "NA",
        },
        _9_3: {
          remarks: "NA",
        },
        _1_5: {
          remarks: "NA",
        },
        _9_4: {
          remarks: "NA",
        },
        _5_1: {
          remarks: "NA",
        },
        _23_5: {
          remarks: "NA",
        },
        _27_1: {
          remarks: "NA",
        },
        _5_2: {
          remarks: "NA",
        },
        _27_2: {
          remarks: "NA",
        },
        _5_3: {
          remarks: "NA",
        },
        _23_3: {
          remarks: "NA",
        },
        _5_4: {
          remarks: "NA",
        },
        _23_4: {
          remarks: "NA",
        },
        _27_5: {
          remarks: "NA",
        },
        _27_3: {
          remarks: "NA",
        },
        _27_4: {
          remarks: "NA",
        },
        _1_4: {
          remarks: "NA",
        },
        _1_3: {
          remarks: "NA",
        },
        _1_1: {
          remarks: "NA",
        },
        _9_5: {
          remarks: "NA",
        },
        _11_1: {
          remarks: "NA",
        },
        _11_3: {
          remarks: "NA",
        },
        _11_2: {
          remarks: "NA",
        },
        _11_5: {
          remarks: "NA",
        },
        _15_1: {
          remarks: "NA",
        },
        _11_4: {
          remarks: "NA",
        },
        _15_3: {
          remarks: "NA",
        },
        _15_2: {
          remarks: "NA",
        },
        _15_5: {
          remarks: "NA",
        },
        _19_1: {
          remarks: "NA",
        },
        _15_4: {
          remarks: "NA",
        },
        _19_3: {
          remarks: "NA",
        },
        _19_2: {
          remarks: "NA",
        },
        _19_5: {
          remarks: "NA",
        },
        _19_4: {
          remarks: "NA",
        },
      },
      userId: "somnath.deshmukh@greenwave.co.in",
      role: "NA-Role",
      transactionTimestamp: "2024-04-08T07:05:27.047+00:00",
      userRemarks: "data updated from ok to NOT ok in cell id _28_4\r\n",
    },
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % myList.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + myList.length) % myList.length
    );
  };

  return (
    <div>
      <h2>List:</h2>
      <ul>
        {myList.map((item, index) => (
          <li
            key={index}
            style={{ display: index === currentIndex ? "block" : "none" }}
          >
            <p>transactionId = {item.transactionId}</p>
            <p>jobId = {item.jobId}</p>
            <p>activityId = {item.activityId}</p>
            <p>formName = {item.formName}</p>
            <p>formversion = {item.formversion}</p>
            <p>logbookData = {item.logbookData.toString()}</p>
          </li>
        ))}
      </ul>
      <button onClick={handlePrev} disabled={currentIndex === 0}>
        Previous
      </button>
      <button
        onClick={handleNext}
        disabled={currentIndex === myList.length - 1}
      >
        Next
      </button>
    </div>
  );
}

export default NavigationTest;
