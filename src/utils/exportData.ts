/**
 * Export utilities for dashboard data
 * Supports PDF, Excel, and CSV formats
 */

// Note: These functions require additional packages to be installed
// npm install jspdf xlsx

interface ExportOptions {
  filename?: string;
  title?: string;
  includeCharts?: boolean;
}

interface DashboardData {
  stats: {
    totalEmployees: number;
    currentMonthKipapp: {
      average: number;
      count: number;
    };
    currentMonthRenak?: {
      average: number;
      count: number;
    };
    currentMonthAttendance: {
      rate: number;
      totalEmployees: number;
      absentEmployees: number;
    };
  };
  recentEntries: Array<{
    type: string;
    employeeName: string;
    value?: string;
    createdAt: string;
  }>;
  performanceTrend: Array<{
    month: string;
    average: number;
  }>;
}

export const exportToPDF = async (data: DashboardData, options: ExportOptions = {}) => {
  try {
    // Dynamic import to avoid build errors if jsPDF is not installed
    const { jsPDF } = await import('jspdf');
    
    const doc = new jsPDF();
    const { filename = 'dashboard-report.pdf', title = 'Dashboard Report' } = options;
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString('id-ID')}`, 14, 32);
    
    // Add statistics section
    doc.setFontSize(16);
    doc.text('Statistik Dashboard', 14, 50);
    
    doc.setFontSize(12);
    doc.text(`Total Pegawai: ${data.stats.totalEmployees}`, 14, 65);
    doc.text(`Rata-rata KIPAPP: ${data.stats.currentMonthKipapp.average.toFixed(2)}`, 14, 75);
    if (data.stats.currentMonthRenak) {
      doc.text(`Rata-rata RENAK CAN: ${data.stats.currentMonthRenak.average.toFixed(2)}`, 14, 85);
      doc.text(`Tingkat Kehadiran: ${data.stats.currentMonthAttendance.rate.toFixed(1)}%`, 14, 95);
    } else {
      doc.text(`Tingkat Kehadiran: ${data.stats.currentMonthAttendance.rate.toFixed(1)}%`, 14, 85);
    }
    
    // Add recent entries
    doc.setFontSize(16);
    doc.text('Aktivitas Terbaru', 14, 105);
    
    doc.setFontSize(10);
    data.recentEntries.slice(0, 10).forEach((entry, index) => {
      const y = 115 + (index * 8);
      doc.text(`${entry.type}: ${entry.employeeName} - ${entry.value || 'N/A'}`, 14, y);
    });
    
    // Add performance trend
    if (data.performanceTrend.length > 0) {
      doc.setFontSize(16);
      doc.text('Trend Performa', 14, 200);
      
      doc.setFontSize(10);
      data.performanceTrend.forEach((trend, index) => {
        const y = 210 + (index * 8);
        doc.text(`${trend.month}: ${trend.average.toFixed(2)}`, 14, y);
      });
    }
    
    doc.save(filename);
    return { success: true };
  } catch (error) {
    console.error('PDF export error:', error);
    throw new Error('Failed to export PDF. Please install jsPDF package.');
  }
};

export const exportToExcel = async (data: DashboardData, options: ExportOptions = {}) => {
  try {
    // Dynamic import to avoid build errors if xlsx is not installed
    const XLSX = await import('xlsx');
    
    const { filename = 'dashboard-report.xlsx' } = options;
    
    // Prepare data for Excel
    const statsData = [
      ['Metric', 'Value'],
      ['Total Pegawai', data.stats.totalEmployees],
      ['Rata-rata KIPAPP', data.stats.currentMonthKipapp.average],
      ['Jumlah Entri KIPAPP', data.stats.currentMonthKipapp.count],
      ['Tingkat Kehadiran (%)', data.stats.currentMonthAttendance.rate],
      ['Total Pegawai Absen', data.stats.currentMonthAttendance.absentEmployees],
    ];
    if (data.stats.currentMonthRenak) {
      statsData.splice(3, 0, ['Rata-rata RENAK CAN', data.stats.currentMonthRenak.average]);
      statsData.splice(4, 0, ['Jumlah Entri RENAK CAN', data.stats.currentMonthRenak.count]);
    }
    
    const recentData = [
      ['Type', 'Employee', 'Value', 'Date'],
      ...data.recentEntries.map(entry => [
        entry.type,
        entry.employeeName,
        entry.value || 'N/A',
        new Date(entry.createdAt).toLocaleDateString('id-ID')
      ])
    ];
    
    const trendData = [
      ['Month', 'Average'],
      ...data.performanceTrend.map(trend => [trend.month, trend.average])
    ];
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Add sheets
    wb.Sheets['Statistics'] = XLSX.utils.aoa_to_sheet(statsData);
    wb.Sheets['Recent Activity'] = XLSX.utils.aoa_to_sheet(recentData);
    wb.Sheets['Performance Trend'] = XLSX.utils.aoa_to_sheet(trendData);
    
    // Write file
    XLSX.writeFile(wb, filename);
    return { success: true };
  } catch (error) {
    console.error('Excel export error:', error);
    throw new Error('Failed to export Excel. Please install xlsx package.');
  }
};

export const exportToCSV = (data: DashboardData, options: ExportOptions = {}) => {
  try {
    const { filename = 'dashboard-report.csv' } = options;
    
    // Prepare CSV content
    let csvContent = 'Metric,Value\n';
    csvContent += `Total Pegawai,${data.stats.totalEmployees}\n`;
    csvContent += `Rata-rata KIPAPP,${data.stats.currentMonthKipapp.average.toFixed(2)}\n`;
    csvContent += `Jumlah Entri KIPAPP,${data.stats.currentMonthKipapp.count}\n`;
    if (data.stats.currentMonthRenak) {
      csvContent += `Rata-rata RENAK CAN,${data.stats.currentMonthRenak.average.toFixed(2)}\n`;
      csvContent += `Jumlah Entri RENAK CAN,${data.stats.currentMonthRenak.count}\n`;
    }
    csvContent += `Tingkat Kehadiran (%),${data.stats.currentMonthAttendance.rate.toFixed(1)}\n`;
    csvContent += `Total Pegawai Absen,${data.stats.currentMonthAttendance.absentEmployees}\n\n`;
    
    csvContent += 'Type,Employee,Value,Date\n';
    data.recentEntries.forEach(entry => {
      csvContent += `${entry.type},${entry.employeeName},${entry.value || 'N/A'},${new Date(entry.createdAt).toLocaleDateString('id-ID')}\n`;
    });
    
    csvContent += '\nMonth,Average\n';
    data.performanceTrend.forEach(trend => {
      csvContent += `${trend.month},${trend.average.toFixed(2)}\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    return { success: true };
  } catch (error) {
    console.error('CSV export error:', error);
    throw new Error('Failed to export CSV.');
  }
};

export const printDashboard = (data: DashboardData) => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      throw new Error('Failed to open print window. Please allow popups.');
    }
    
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dashboard Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
            h2 { color: #666; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .stat-item { background: #f9f9f9; padding: 15px; border-radius: 5px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <h1>Dashboard Report - BPS Kabupaten Jombang</h1>
          <p><strong>Generated:</strong> ${new Date().toLocaleString('id-ID')}</p>
          
          <h2>Statistik Dashboard</h2>
          <div class="stats">
            <div class="stat-item">
              <strong>Total Pegawai:</strong> ${data.stats.totalEmployees}
            </div>
            <div class="stat-item">
              <strong>Rata-rata KIPAPP:</strong> ${data.stats.currentMonthKipapp.average.toFixed(2)}
            </div>
            <div class="stat-item">
              <strong>Tingkat Kehadiran:</strong> ${data.stats.currentMonthAttendance.rate.toFixed(1)}%
            </div>
            <div class="stat-item">
              <strong>Pegawai Absen:</strong> ${data.stats.currentMonthAttendance.absentEmployees}
            </div>
          </div>
          
          <h2>Aktivitas Terbaru</h2>
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Employee</th>
                <th>Value</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${data.recentEntries.map(entry => `
                <tr>
                  <td>${entry.type}</td>
                  <td>${entry.employeeName}</td>
                  <td>${entry.value || 'N/A'}</td>
                  <td>${new Date(entry.createdAt).toLocaleDateString('id-ID')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          ${data.performanceTrend.length > 0 ? `
            <h2>Trend Performa</h2>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Average</th>
                </tr>
              </thead>
              <tbody>
                ${data.performanceTrend.map(trend => `
                  <tr>
                    <td>${trend.month}</td>
                    <td>${trend.average.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : ''}
        </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
    
    return { success: true };
  } catch (error) {
    console.error('Print error:', error);
    throw new Error('Failed to print dashboard.');
  }
};

export default {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  printDashboard
};
