import { useEffect, useRef } from "react";
import { Timeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

export default function GanttChartComponent2({ data }) {
  const containerRef = useRef();

  useEffect(() => {
    const items = data.map((item, i) => ({
      id: i,
      content: item.name,
      start: item.start,
      end: item.end,
      className: item.status === 'dropped' ? 'gantt-red' : ''
    }));

    const options = {
      stack: true,
      orientation: "top",
      editable: false,
      margin: { item: 15, axis: 10 },
      zoomMin: 1000,
      zoomMax: 1000 * 60,
      format: {
        minorLabels: {
          second: 'HH:mm:ss',
        },
        majorLabels: {
          second: 'D MMM YYYY',
        }
      }
    };
    const timeline = new Timeline(containerRef.current, items, options);

    return () => timeline.destroy();
  }, [data]);

  return <div ref={containerRef} style={{ height: "300px" }} />;
}
