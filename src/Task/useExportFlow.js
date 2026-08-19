// useExportFlow.js
import { useCallback } from "react";
import {
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
} from "reactflow";
import { toPng, toSvg, toJpeg } from "html-to-image";

export const useExportFlow = () => {
  const { getNodes } = useReactFlow();

  // ✅ FIX: Inline all SVG/edge styles before capture
  const inlineEdgeStyles = (element) => {
    const savedStyles = [];

    // 1. Fix edge paths (the actual connection lines)
    const paths = element.querySelectorAll(
      ".react-flow__edge path, .react-flow__connectionline path"
    );
    paths.forEach((path, i) => {
      const computed = window.getComputedStyle(path);
      savedStyles.push({
        element: path,
        stroke: path.style.stroke,
        strokeWidth: path.style.strokeWidth,
        fill: path.style.fill,
        strokeOpacity: path.style.strokeOpacity,
        strokeDasharray: path.style.strokeDasharray,
      });

      // Force inline styles from computed CSS
      path.style.stroke = computed.stroke || "#b1b1b7";
      path.style.strokeWidth = computed.strokeWidth || "1px";
      path.style.fill = computed.fill || "none";
      path.style.strokeOpacity = computed.strokeOpacity || "1";
      if (computed.strokeDasharray) {
        path.style.strokeDasharray = computed.strokeDasharray;
      }
    });

    // 2. Fix edge SVG containers
    const edgeSvgs = element.querySelectorAll("svg.react-flow__edges");
    edgeSvgs.forEach((svg) => {
      svg.style.overflow = "visible";
    });

    // 3. Fix marker/arrowhead elements
    const markerPaths = element.querySelectorAll("marker path, marker polygon");
    markerPaths.forEach((marker) => {
      const computed = window.getComputedStyle(marker);
      savedStyles.push({
        element: marker,
        fill: marker.style.fill,
        stroke: marker.style.stroke,
      });
      marker.style.fill = computed.fill || "#b1b1b7";
      marker.style.stroke = computed.stroke || "none";
    });

    // 4. Fix edge labels (if any)
    const labels = element.querySelectorAll(
      ".react-flow__edge-text, .react-flow__edge-textbg"
    );
    labels.forEach((label) => {
      const computed = window.getComputedStyle(label);
      savedStyles.push({
        element: label,
        fill: label.style.fill,
        fontSize: label.style.fontSize,
      });
      label.style.fill = computed.fill || "#000";
      label.style.fontSize = computed.fontSize || "10px";
    });

    // 5. Fix edge label backgrounds
    const labelBgs = element.querySelectorAll(".react-flow__edge-textbg");
    labelBgs.forEach((bg) => {
      const computed = window.getComputedStyle(bg);
      savedStyles.push({
        element: bg,
        fill: bg.style.fill,
      });
      bg.style.fill = computed.fill || "#ffffff";
    });

    // Return restore function to undo all changes
    return () => {
      savedStyles.forEach(({ element: el, ...styles }) => {
        Object.keys(styles).forEach((key) => {
          el.style[key] = styles[key] || "";
        });
      });
    };
  };

  const exportImage = useCallback(
    async (options = {}) => {
      const {
        format = "png",
        quality = 4,
        padding = 50,
        backgroundColor = "#ffffff",
        fileName = "flow-diagram",
      } = options;

      const viewportElement = document.querySelector(
        ".react-flow__viewport"
      );

      if (!viewportElement) {
        console.error("React Flow viewport not found");
        return;
      }

      const nodes = getNodes();
      if (nodes.length === 0) {
        console.error("No nodes to export");
        return;
      }

      const nodesBounds = getNodesBounds(nodes);
      const width = nodesBounds.width + padding * 2;
      const height = nodesBounds.height + padding * 2;

      const viewport = getViewportForBounds(
        nodesBounds,
        width,
        height,
        0.5,
        2,
        padding
      );

      // ✅ INLINE EDGE STYLES BEFORE CAPTURE
      const restoreStyles = inlineEdgeStyles(viewportElement);

      const imageOptions = {
        backgroundColor,
        width,
        height,
        pixelRatio: quality,
        cacheBust: true, // ✅ Prevent caching issues
        imagePlaceholder: undefined,
        // ✅ Include SVG stylesheets
        includeQueryParams: true,
        style: {
          width: `${width}px`,
          height: `${height}px`,
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
        filter: (node) => {
          if (node?.classList) {
            const excludeClasses = [
              "react-flow__minimap",
              "react-flow__controls",
              "react-flow__background",
              "react-flow__attribution",
            ];
            return !excludeClasses.some((cls) =>
              node.classList.contains(cls)
            );
          }
          return true;
        },
      };

      try {
        let dataUrl;

        switch (format) {
          case "svg":
            dataUrl = await toSvg(viewportElement, imageOptions);
            break;
          case "jpeg":
            dataUrl = await toJpeg(viewportElement, {
              ...imageOptions,
              quality: 0.95,
            });
            break;
          default:
            dataUrl = await toPng(viewportElement, imageOptions);
        }

        // ✅ RESTORE original styles after capture
        restoreStyles();

        // Download the image
        const link = document.createElement("a");
        link.download = `${fileName}.${format}`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return dataUrl;
      } catch (error) {
        // ✅ RESTORE even if there's an error
        restoreStyles();
        console.error("Failed to export image:", error);
        throw error;
      }
    },
    [getNodes]
  );

  return { exportImage };
};