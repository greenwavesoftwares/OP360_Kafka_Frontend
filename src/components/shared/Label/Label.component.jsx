import { Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";

// creating the custom useInterval hook
function useInterval(callback, delay) {
  // Creating a ref
  const savedCallback = useRef();

  // To remember the latest callback .
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // combining the setInterval and
  //clearInterval methods based on delay.
  useEffect(() => {
    function func() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(func, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const parseCssString = (cssString) => {
  const toCamelCase = (str) =>
    str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

  return cssString
    ? cssString.split(";").reduce((acc, rule) => {
        const [property, value] = rule.split(":");
        if (property && value) {
          const key = toCamelCase(property.trim());
          let val = value.trim();

          // Convert fontSize to number if possible
          if (key === "fontSize") {
            if (val.endsWith("px")) val = parseInt(val, 10);
            else if (!isNaN(Number(val))) val = Number(val);
          }
          // Convert fontWeight to number if possible
          if (key === "fontWeight") {
            if (!isNaN(Number(val))) val = Number(val);
          }
          acc[key] = val;
        }
        return acc;
      }, {})
    : {};
};

function Label({
  elem,
  pollObj,
  setPollObj,
  gridDataTest,
  setGridDataTest,
  findSQL,
  getQueryResultForGlobalCellUpdate,
  getQueryResult,
  onDependentCellUpdate,
  onPassiveFieldChange,
}) {
  const parsedStyles = parseCssString(elem.cellCSS);
  console.log("Label Call");

  let cellObj = pollObj.find((item) => {
    return elem.cellId === item.cell.cellId;
  });

  if (cellObj === undefined) {
    cellObj = {
      autoRefresh: false,
      pollInterval: null,
      cell: null,
    };
  }

  useInterval(
    async () => {
      try {
        console.log("🔄 Label Poll triggered for:", cellObj.cell.cellId);

        let updatedGridDataTest = [...gridDataTest];
        const currentCell = cellObj.cell;

        // 1️⃣ Execute depExpressionLogic and update the label value
        if (currentCell.depExpressionLogic?.trim()) {
          console.log(
            "📊 Executing depExpressionLogic for Label:",
            currentCell.cellId
          );

          const sql = await findSQL(
            currentCell.depExpressionLogic,
            currentCell,
            updatedGridDataTest
          );
          console.log("🔍 SQL/Expression:", sql);

          let newValue = null;
          let oldValue = currentCell.value;

          // ==================================
          // === Handle Different Field Types ===
          // ==================================

          // 🔽 DROPDOWN FIELD TYPE
          if (currentCell.fieldType === "Dropdown") {
            console.log(
              "🔽 [DROPDOWN] Processing dropdown:",
              currentCell.cellId
            );
            console.log("🔽 [DROPDOWN] SQL:", sql);

            let sqlRes;
            try {
              console.log("🔽 [DROPDOWN] About to call getQueryResult...");
              sqlRes = await getQueryResult(sql);

              console.log(
                "🔽 [DROPDOWN] ✅ getQueryResult completed successfully"
              );
              console.log("🔽 [DROPDOWN] SQL Result:", sqlRes);
              console.log(
                "🔽 [DROPDOWN] Result count:",
                Array.isArray(sqlRes) ? sqlRes.length : 0
              );
            } catch (error) {
              console.error(
                "❌ [DROPDOWN] getQueryResult failed for",
                currentCell.cellId
              );
              console.error("❌ [DROPDOWN] Error:", error);
              console.error("❌ [DROPDOWN] Error message:", error.message);
              console.error("❌ [DROPDOWN] Error stack:", error.stack);
              console.error("❌ [DROPDOWN] SQL that failed:", sql);

              sqlRes = []; // Default to empty array on error
            }

            // Update dropdown fields in the grid data
            updatedGridDataTest = updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((cell) => {
                if (cell.cellId === currentCell.cellId) {
                  return {
                    ...cell,
                    dropDownFields: Array.isArray(sqlRes) ? sqlRes : [],
                  };
                }
                return cell;
              }),
            }));

            console.log(
              "🔽 [DROPDOWN] Updated dropDownFields count:",
              Array.isArray(sqlRes) ? sqlRes.length : 0
            );
          }
          // 🔢 NUMBER FIELD TYPE
          else if (currentCell.fieldType === "Number") {
            if (currentCell.depExpressionType === "Expression") {
              newValue = eval(sql);
              console.log("🔢 [NUMBER-EXPRESSION] Result:", newValue);
            } else {
              const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
              newValue = sqlRes ? Object.values(sqlRes)[0] : null;
              console.log("🔢 [NUMBER-SQL] Result:", newValue);
            }

            // Update the number value
            updatedGridDataTest = updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((cell) => {
                if (cell.cellId === currentCell.cellId) {
                  return {
                    ...cell,
                    value: newValue,
                  };
                }
                return cell;
              }),
            }));
          }
          // 📝 OTHER FIELD TYPES (Text, Label, etc.)
          else {
            if (currentCell.depExpressionType === "Expression") {
              newValue = eval(sql);
              console.log("📝 [EXPRESSION] Result:", newValue);
            } else {
              const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
              newValue = sqlRes ? Object.values(sqlRes)[0] : null;
              console.log("📝 [SQL] Result:", newValue);
            }

            // Update the value
            updatedGridDataTest = updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((cell) => {
                if (cell.cellId === currentCell.cellId) {
                  return {
                    ...cell,
                    value: newValue,
                  };
                }
                return cell;
              }),
            }));
          }

          console.log("📦 Step 1: Label value updated:", updatedGridDataTest);

          // 2️⃣ Run DEPENDENT FIELD updates if value changed (SEQUENTIALLY)
          if (
            oldValue !== newValue &&
            Array.isArray(currentCell.dependentFields) &&
            currentCell.dependentFields.length > 0
          ) {
            console.log(
              "🔄 Processing",
              currentCell.dependentFields.length,
              "dependent fields"
            );

            // ✅ SEQUENTIAL processing to avoid race conditions
            for (const dep of currentCell.dependentFields) {
              console.log("🔄 Processing dependent field:", dep.cellId);

              const depResult = await onDependentCellUpdate(
                dep,
                updatedGridDataTest, // ← Pass the latest data
                () => {}, // ← Don't update state yet
                [currentCell.cellId],
                false // ← Mark as NOT top level
              );

              // Update with the latest result
              if (Array.isArray(depResult)) {
                updatedGridDataTest = depResult;
                console.log("✅ Dependent field updated:", dep.cellId);
              }
            }

            console.log(
              "📦 Step 2: All dependent fields processed:",
              updatedGridDataTest
            );
          }

          // 3️⃣ DISABLE EXPRESSION LOGIC
          if (currentCell.disableExpressionLogic?.trim()) {
            console.log(
              "🔒 Processing disable expression for Label:",
              currentCell.cellId
            );
            const isExpr = currentCell.disabledExpType === "Expression";

            const disableVal = isExpr
              ? eval(
                  await findSQL(
                    currentCell.disableExpressionLogic,
                    currentCell,
                    updatedGridDataTest
                  )
                )
              : await (async () => {
                  const sql = await findSQL(
                    currentCell.disableExpressionLogic,
                    currentCell,
                    updatedGridDataTest
                  );
                  console.log("🔒 Disable SQL:", sql);
                  const sqlRes = await getQueryResultForGlobalCellUpdate(sql);
                  console.log("🔒 Disable SQL Result:", sqlRes);
                  return sqlRes ? Object.values(sqlRes)[0] : 0;
                })();

            const isDisabled =
              disableVal === 1 || disableVal === "1" || disableVal === true;
            console.log("🔒 Label will be disabled:", isDisabled);

            updatedGridDataTest = updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((cell) =>
                cell.cellId === currentCell.cellId
                  ? { ...cell, disabled: isDisabled }
                  : cell
              ),
            }));
            console.log(
              "📦 Step 3: Disable logic applied:",
              updatedGridDataTest
            );
          }

          // 4️⃣ FINAL STATE UPDATE - Only update once at the end!
          console.log("💾 Final state update for Label:", updatedGridDataTest);
          setGridDataTest(
            updatedGridDataTest.map((form) => ({
              ...form,
              cellData: form.cellData.map((c) => ({ ...c })),
            }))
          );

          console.log("✅ Label poll complete for:", currentCell.cellId);
        }
      } catch (error) {
        console.error("❌ Error in Label poll:", error);
        console.error("Stack:", error.stack);
      }
    },
    // Passing in the delay parameter. null stops the counter.
    cellObj.autoRefresh ? cellObj.pollInterval * 1000 : null
  );

  return (
    <>
      <span
        style={{
          fontWeight: parsedStyles.fontWeight || 500,
          fontSize: parsedStyles.fontSize || "0.95rem",
          opacity: elem.disabled ? 0.5 : 1,
          pointerEvents: elem.disabled ? "none" : "auto",
        }}
      >
        {elem.fieldType === "File"
          ? elem.aliasId
          : elem.value || elem.value === 0
          ? elem.value
          : elem.aliasId}
      </span>
    </>
  );
}

export default Label;
