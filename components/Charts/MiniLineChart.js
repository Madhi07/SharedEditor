import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function MiniLineChart({ data = {} }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const datasetStyles = {
        borderColor: '#ff3a8c',
        backgroundColor: 'rgb(255 58 140 / 0.2)',
        fill: true,
        borderWidth: 2,
    }

    const datasets = data?.datasets?.map(dataset => ({ ...dataset, ...datasetStyles }));

    const newData = {
        labels: data?.labels,
        datasets
    };

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');

        if (chartRef.current) {
            chartRef.current.destroy(); // Destroy previous chart to prevent memory leaks
        }

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: newData,            
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    }
                },
                scales: {
                    x: {
                        display: false,
                    },
                    y: {
                        display: false,
                    }
                },
                elements: {
                    point: {
                        radius: 0,
                    },
                    line: {
                        tension: 0.4,
                    }
                }
            }
        });

        return () => {
            chartRef.current?.destroy(); // Clean up on unmount
        };
    }, [data]);

    return (
        <canvas ref={canvasRef} />
    );
}
