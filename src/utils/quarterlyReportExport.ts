import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatIndonesianDecimal } from './quarterlyReportUtils';
import type { EmployeeCalculatedData } from './quarterlyReportUtils';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}

export interface ExportData {
  employees: EmployeeCalculatedData[];
  selectedYear: number;
  selectedQuarter: number;
  monthLabels: string[];
}

export function exportQuarterlyReportToPDF(data: ExportData) {
  const { employees, selectedYear, selectedQuarter, monthLabels } = data;
  
  // Create PDF in A3 landscape for better fit of 18 columns
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a3'
  });

  // Title and subtitle
  const title = 'Laporan Triwulan Penilaian Kinerja BPS Jombang';
  const quarterLabels: Record<number, string> = {
    1: 'Triwulan I (Januari - Maret)',
    2: 'Triwulan II (April - Juni)',
    3: 'Triwulan III (Juli - September)',
    4: 'Triwulan IV (Oktober - Desember)',
  };
  const subtitle = `Tahun ${selectedYear} ${quarterLabels[selectedQuarter]}`;

  // Add title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 20, { align: 'center' });

  // Add subtitle
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(subtitle, doc.internal.pageSize.getWidth() / 2, 30, { align: 'center' });

  // Prepare column headers
  const columnHeaders = [
    'No',
    'Nama',
    `Kipapp ${monthLabels[0]}`,
    `Kipapp ${monthLabels[1]}`,
    `Kipapp ${monthLabels[2]}`,
    'Rata Kipapp',
    'Rata2 Tertimbang (Kipapp)',
    `Absen ${monthLabels[0]}`,
    `Absen ${monthLabels[1]}`,
    `Absen ${monthLabels[2]}`,
    'ABSENSI',
    `ABSEN RENAK CAN ${monthLabels[0]}`,
    `ABSEN RENAK CAN ${monthLabels[1]}`,
    `ABSEN RENAK CAN ${monthLabels[2]}`,
    'TOTAL ABSEN RENAK',
    'Rata2 Tertimbang (Renak Can)',
    'Final',
    'Peringkat'
  ];

  // Prepare data rows
  const tableData = employees.map((employee, index) => [
    (index + 1).toString(),
    employee.name,
    formatIndonesianDecimal(employee.kipappMonth1, 2),
    formatIndonesianDecimal(employee.kipappMonth2, 2),
    formatIndonesianDecimal(employee.kipappMonth3, 2),
    formatIndonesianDecimal(employee.rataKipapp, 2),
    formatIndonesianDecimal(employee.rataTertimbangKipapp, 2),
    employee.absenMonth1.toString(),
    employee.absenMonth2.toString(),
    employee.absenMonth3.toString(),
    formatIndonesianDecimal(employee.absensi, 2),
    employee.renakMonth1.toString(),
    employee.renakMonth2.toString(),
    employee.renakMonth3.toString(),
    employee.totalAbsenRenak.toString(),
    formatIndonesianDecimal(employee.rataTertimbangRenakCan, 2),
    formatIndonesianDecimal(employee.finalScore, 2),
    employee.peringkat.toString()
  ]);

  // Configure autoTable
  const tableConfig = {
    head: [columnHeaders],
    body: tableData,
    startY: 40,
    theme: 'grid' as const,
    styles: {
      fontSize: 7,
      cellPadding: 1.5,
      overflow: 'linebreak' as const,
    },
    headStyles: {
      fillColor: [79, 70, 229], // Indigo color
      textColor: [255, 255, 255],
      halign: 'center' as const,
      fontStyle: 'bold' as const,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 }, // No
      1: { halign: 'left', cellWidth: 25 }, // Nama
      2: { halign: 'right', cellWidth: 15 }, // Kipapp Month 1
      3: { halign: 'right', cellWidth: 15 }, // Kipapp Month 2
      4: { halign: 'right', cellWidth: 15 }, // Kipapp Month 3
      5: { halign: 'right', cellWidth: 15 }, // Rata Kipapp
      6: { halign: 'right', cellWidth: 20 }, // Rata2 Tertimbang Kipapp
      7: { halign: 'right', cellWidth: 12 }, // Absen Month 1
      8: { halign: 'right', cellWidth: 12 }, // Absen Month 2
      9: { halign: 'right', cellWidth: 12 }, // Absen Month 3
      10: { halign: 'right', cellWidth: 15 }, // ABSENSI
      11: { halign: 'right', cellWidth: 18 }, // RENAK Month 1
      12: { halign: 'right', cellWidth: 18 }, // RENAK Month 2
      13: { halign: 'right', cellWidth: 18 }, // RENAK Month 3
      14: { halign: 'right', cellWidth: 20 }, // TOTAL ABSEN RENAK
      15: { halign: 'right', cellWidth: 22 }, // Rata2 Tertimbang Renak Can
      16: { halign: 'right', cellWidth: 15 }, // Final
      17: { halign: 'center', cellWidth: 12 }, // Peringkat
    },
    margin: { top: 40, left: 10, right: 10 },
    tableWidth: 'auto' as const,
    showHead: 'everyPage' as const,
    didDrawPage: function(data: any) {
      // Add page numbers
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageCount}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    }
  };

  // Generate table
  doc.autoTable(tableConfig);

  // Save the PDF
  const fileName = `Laporan_Triwulan_${selectedYear}_Q${selectedQuarter}.pdf`;
  doc.save(fileName);
}

export function exportQuarterlyReportToExcel(data: ExportData) {
  const { employees, selectedYear, selectedQuarter, monthLabels } = data;
  
  // Create new workbook
  const wb = XLSX.utils.book_new();
  
  // Prepare data for Excel
  const quarterLabels: Record<number, string> = {
    1: 'Triwulan I (Januari - Maret)',
    2: 'Triwulan II (April - Juni)',
    3: 'Triwulan III (Juli - September)',
    4: 'Triwulan IV (Oktober - Desember)',
  };

  // Create worksheet data
  const wsData = [
    // Title row
    ['Laporan Triwulan Penilaian Kinerja BPS Jombang'],
    // Subtitle row
    [`Tahun ${selectedYear} ${quarterLabels[selectedQuarter]}`],
    // Empty row
    [],
    // Header row
    [
      'No',
      'Nama',
      `Kipapp ${monthLabels[0]}`,
      `Kipapp ${monthLabels[1]}`,
      `Kipapp ${monthLabels[2]}`,
      'Rata Kipapp',
      'Rata2 Tertimbang (Kipapp)',
      `Absen ${monthLabels[0]}`,
      `Absen ${monthLabels[1]}`,
      `Absen ${monthLabels[2]}`,
      'ABSENSI',
      `ABSEN RENAK CAN ${monthLabels[0]}`,
      `ABSEN RENAK CAN ${monthLabels[1]}`,
      `ABSEN RENAK CAN ${monthLabels[2]}`,
      'TOTAL ABSEN RENAK',
      'Rata2 Tertimbang (Renak Can)',
      'Final',
      'Peringkat'
    ],
    // Data rows
    ...employees.map((employee, index) => [
      index + 1,
      employee.name,
      employee.kipappMonth1,
      employee.kipappMonth2,
      employee.kipappMonth3,
      employee.rataKipapp,
      employee.rataTertimbangKipapp,
      employee.absenMonth1,
      employee.absenMonth2,
      employee.absenMonth3,
      employee.absensi,
      employee.renakMonth1,
      employee.renakMonth2,
      employee.renakMonth3,
      employee.totalAbsenRenak,
      employee.rataTertimbangRenakCan,
      employee.finalScore,
      employee.peringkat
    ])
  ];

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Merge title cells (A1:R1)
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 17 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 17 } }
  ];

  // Set column widths
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 25 }, // Nama
    { wch: 12 }, // Kipapp Month 1
    { wch: 12 }, // Kipapp Month 2
    { wch: 12 }, // Kipapp Month 3
    { wch: 12 }, // Rata Kipapp
    { wch: 18 }, // Rata2 Tertimbang Kipapp
    { wch: 10 }, // Absen Month 1
    { wch: 10 }, // Absen Month 2
    { wch: 10 }, // Absen Month 3
    { wch: 12 }, // ABSENSI
    { wch: 15 }, // RENAK Month 1
    { wch: 15 }, // RENAK Month 2
    { wch: 15 }, // RENAK Month 3
    { wch: 18 }, // TOTAL ABSEN RENAK
    { wch: 20 }, // Rata2 Tertimbang Renak Can
    { wch: 12 }, // Final
    { wch: 10 }  // Peringkat
  ];

  // Set freeze panes (freeze first 2 rows and first 2 columns)
  ws['!freeze'] = { xSplit: 2, ySplit: 3 };

  // Apply formatting to title row
  const titleCell = ws['A1'];
  if (titleCell) {
    titleCell.s = {
      font: { bold: true, size: 14 },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  // Apply formatting to subtitle row
  const subtitleCell = ws['A2'];
  if (subtitleCell) {
    subtitleCell.s = {
      font: { bold: true, size: 12 },
      alignment: { horizontal: 'center', vertical: 'center' }
    };
  }

  // Apply formatting to header row
  for (let col = 0; col < 18; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 3, c: col });
    const cell = ws[cellAddress];
    if (cell) {
      cell.s = {
        font: { bold: true },
        fill: { fgColor: { rgb: '4F46E5' } }, // Indigo background
        alignment: { horizontal: 'center', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }

  // Apply number formatting to data rows
  for (let row = 4; row < wsData.length; row++) {
    for (let col = 2; col < 18; col++) { // Skip No and Nama columns
      const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
      const cell = ws[cellAddress];
      if (cell && col !== 17) { // Don't format Peringkat column
        if (col >= 2 && col <= 6 || col === 10 || col === 15 || col === 16) {
          // Decimal numbers
          cell.z = '#,##0.00';
        } else if (col >= 7 && col <= 9 || col >= 11 && col <= 14) {
          // Integer numbers
          cell.z = '#,##0';
        }
        cell.s = {
          alignment: { horizontal: 'right', vertical: 'center' },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      } else if (cell && col === 17) {
        // Peringkat column - center aligned
        cell.s = {
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          }
        };
      }
    }
    
    // Nama column formatting
    const nameCellAddress = XLSX.utils.encode_cell({ r: row, c: 1 });
    const nameCell = ws[nameCellAddress];
    if (nameCell) {
      nameCell.s = {
        alignment: { horizontal: 'left', vertical: 'center' },
        border: {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        }
      };
    }
  }

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Triwulan');

  // Save the Excel file
  const fileName = `Laporan_Triwulan_${selectedYear}_Q${selectedQuarter}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
