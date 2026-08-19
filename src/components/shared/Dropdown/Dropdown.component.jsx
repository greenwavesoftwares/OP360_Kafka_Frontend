import React, { useMemo, useEffect, useState } from "react";
import { Dropdown as PrimeReactDropdown } from "primereact/dropdown";
import RefreshIcon from "@mui/icons-material/Refresh";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";

function Dropdown({
  elem,
  onCellValueChange,
  error,
  helperText,
  disabled,
  onRefreshDropdown, // ← NEW PROP
}) {
  // Local loading state for refresh button
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debug logging on every render
  useEffect(() => {
    console.log("🔽 [Dropdown] Component render for:", elem.cellId, {
      cellId: elem.cellId,
      value: elem.value,
      dropDownFieldsCount: elem.dropDownFields?.length || 0,
      hasDropDownFields: !!elem.dropDownFields,
      isArray: Array.isArray(elem.dropDownFields),
      dropDownFields: elem.dropDownFields,
      disabled: elem.disabled,
    });
  });

  // Memoize options to prevent unnecessary re-renders
  const options = useMemo(() => {
    const opts = elem.dropDownFields || [];
    console.log(
      "🔽 [Dropdown] Memoized options for",
      elem.cellId,
      ":",
      opts.length,
      "items",
    );
    return opts;
  }, [elem.dropDownFields]);

  // Memoize selected value
  const selectedValue = useMemo(() => {
    const value =
      options.find(
        (option) =>
          option.itemValue?.toLowerCase?.() === elem.value?.toLowerCase?.(),
      )?.itemValue || "";

    console.log("🔽 [Dropdown] Selected value for", elem.cellId, ":", value);
    return value;
  }, [elem.value, options]);

  // Show clear button only if there's a value
  const showClear = useMemo(() => {
    return !!selectedValue;
  }, [selectedValue]);

  // Warning if no options available
  useEffect(() => {
    if (options.length === 0 && elem.depExpressionLogic?.trim()) {
      console.warn(
        "⚠️ [Dropdown] No options available for:",
        elem.cellId,
        "- Parent should have populated dropDownFields",
      );
    }
  }, [options.length, elem.cellId, elem.depExpressionLogic]);

  // Handle refresh button click
  const handleRefreshClick = async () => {
    if (!onRefreshDropdown) return;

    try {
      setIsRefreshing(true);
      console.log("🔄 [Dropdown] Refresh clicked for:", elem.cellId);
      await onRefreshDropdown();
      console.log("✅ [Dropdown] Refresh complete for:", elem.cellId);
    } catch (error) {
      console.error("❌ [Dropdown] Refresh failed for:", elem.cellId, error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {/* Dropdown */}
        <div style={{ flex: 1 }}>
          <PrimeReactDropdown
            value={selectedValue}
            placeholder={
              options.length === 0 ? "No options available" : "Select One"
            }
            onChange={onCellValueChange}
            required={elem.requiredfield}
            options={options}
            optionLabel="itemLabel"
            optionValue="itemValue"
            disabled={disabled || elem.disabled || options.length === 0}
            className="w-full"
            filter={options.length > 5}
            showClear={showClear}
            invalid={error && !elem.value}
            emptyMessage="No options available"
            emptyFilterMessage="No results found"
          />
        </div>

        {/* Refresh Button - only shown when depExpressionLogic exists */}
        {elem.depExpressionLogic?.trim() && (
          <Tooltip
            title={isRefreshing ? "Refreshing..." : "Refresh options"}
            placement="top"
          >
            <span>
              <IconButton
                size="small"
                onClick={handleRefreshClick}
                disabled={isRefreshing}
                sx={{
                  color: isRefreshing ? "grey.400" : "primary.main",
                  padding: "4px",
                  "&:hover": {
                    backgroundColor: "primary.light",
                    color: "white",
                  },
                }}
              >
                {isRefreshing ? (
                  // Spinner while refreshing
                  <CircularProgress size={18} sx={{ color: "grey.400" }} />
                ) : (
                  // Refresh icon when idle
                  <RefreshIcon fontSize="small" />
                )}
              </IconButton>
            </span>
          </Tooltip>
        )}
      </div>

      {/* Error message */}
      {error && !elem.value && (
        <small style={{ color: "red" }}>{helperText}</small>
      )}
    </div>
  );
}

export default Dropdown;
