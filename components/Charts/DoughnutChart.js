import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const colorSchemes = {
    dark: {
        backgroundColor: ['#10B981', '#6B7280', '#EF4444']
    }
};

const datasetStyles = {
    borderWidth: 0,
};

export default function DoughnutChart({ data = {} }) {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    const datasets = data?.datasets?.map((dataset, index) => ({
        ...dataset,
        ...datasetStyles,
        backgroundColor: colorSchemes.dark.backgroundColor,
    }));

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
            type: 'doughnut',
            data: newData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
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

