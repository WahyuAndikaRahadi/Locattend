<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Carbon\Carbon;

class PresensiExportService
{
    public function export(array $monthlyData, Carbon $monthDate, $supervisorName)
    {
        $spreadsheet = new Spreadsheet();
        
        // Remove default sheet
        $spreadsheet->removeSheetByIndex(0);

        // Sheet 1: Rekap Tim
        $this->createRekapSheet($spreadsheet, $monthlyData);

        // Sheets 2..n: Tiap Karyawan
        foreach ($monthlyData as $member) {
            $this->createKaryawanSheet($spreadsheet, $member, $monthDate, $supervisorName);
        }

        // Set active sheet to the first one
        if ($spreadsheet->getSheetCount() > 0) {
            $spreadsheet->setActiveSheetIndex(0);
        }

        return $spreadsheet;
    }

    private function createRekapSheet(Spreadsheet $spreadsheet, array $monthlyData)
    {
        $sheet = $spreadsheet->createSheet();
        $sheet->setTitle('Rekap Tim');

        // Header
        $headers = ['No', 'Nama Karyawan', 'Total Hadir', 'Total Terlambat', 'Total Izin', 'Total Alpha'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '1', $header);
            $col++;
        }

        // Style header
        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1E3A5F'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ]
        ];
        $sheet->getStyle('A1:F1')->applyFromArray($headerStyle);
        $sheet->getRowDimension(1)->setRowHeight(20);

        $row = 2;
        $totalHadir = 0;
        $totalTerlambat = 0;
        $totalIzin = 0;
        $totalAlpha = 0;

        foreach ($monthlyData as $index => $member) {
            $hadir = $member['hadir'] ?? 0;
            $terlambat = $member['terlambat'] ?? 0;
            $izin = $member['izin'] ?? 0;
            $alpha = $member['alpha'] ?? 0;

            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $member['name']);
            $sheet->setCellValue('C' . $row, $hadir);
            $sheet->setCellValue('D' . $row, $terlambat);
            $sheet->setCellValue('E' . $row, $izin);
            $sheet->setCellValue('F' . $row, $alpha);

            // Alternating row color
            if ($row % 2 === 0) {
                $sheet->getStyle("A{$row}:F{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF8F9FA');
            }

            // Align center for numbers
            $sheet->getStyle("A{$row}:A{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $sheet->getStyle("C{$row}:F{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            $totalHadir += $hadir;
            $totalTerlambat += $terlambat;
            $totalIzin += $izin;
            $totalAlpha += $alpha;

            $row++;
        }

        // Total Row
        $sheet->setCellValue('A' . $row, 'TOTAL');
        $sheet->mergeCells("A{$row}:B{$row}");
        $sheet->setCellValue('C' . $row, $totalHadir);
        $sheet->setCellValue('D' . $row, $totalTerlambat);
        $sheet->setCellValue('E' . $row, $totalIzin);
        $sheet->setCellValue('F' . $row, $totalAlpha);

        $totalStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1E3A5F'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
            ]
        ];
        $sheet->getStyle("A{$row}:F{$row}")->applyFromArray($totalStyle);

        // Auto size columns
        foreach (range('A', 'F') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }

    private function createKaryawanSheet(Spreadsheet $spreadsheet, array $member, Carbon $monthDate, $supervisorName)
    {
        $sheet = $spreadsheet->createSheet();
        
        // Limit sheet name to 31 chars
        $sheetName = substr($member['name'], 0, 31);
        $sheet->setTitle($sheetName);

        // Header Info
        $sheet->setCellValue('A1', 'Nama: ' . $member['name']);
        $sheet->mergeCells('A1:D1');
        
        $officeName = $member['office_name'] ?? '-';
        $sheet->setCellValue('A2', 'Kantor: ' . $officeName);
        $sheet->mergeCells('A2:D2');

        $sheet->setCellValue('A3', 'Periode: ' . $monthDate->translatedFormat('F Y'));
        $sheet->mergeCells('A3:D3');

        $sheet->setCellValue('A4', 'Supervisor: ' . $supervisorName);
        $sheet->mergeCells('A4:D4');

        $sheet->getStyle('A1:A4')->getFont()->setBold(true);

        // Table Header
        $headers = ['No', 'Tanggal', 'Hari', 'Status', 'Jam Masuk', 'Jam Keluar', 'Durasi Kerja', 'Tugas yang Dikerjakan', 'Keterangan'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '6', $header);
            $col++;
        }

        $headerStyle = [
            'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['argb' => 'FF1E3A5F'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ]
        ];
        $sheet->getStyle('A6:I6')->applyFromArray($headerStyle);
        $sheet->getRowDimension(6)->setRowHeight(20);

        // Table Data
        $row = 7;
        $dailyRecords = $member['daily_records'] ?? [];

        foreach ($dailyRecords as $index => $record) {
            $sheet->setCellValue('A' . $row, $index + 1);
            $sheet->setCellValue('B' . $row, $record['date_formatted']);
            $sheet->setCellValue('C' . $row, $record['day_name']);
            $sheet->setCellValue('D' . $row, ucfirst($record['status']));
            $sheet->setCellValue('E' . $row, $record['clock_in'] ?: '—');
            $sheet->setCellValue('F' . $row, $record['clock_out'] ?: '—');
            $sheet->setCellValue('G' . $row, $record['duration'] ?: '—');
            $sheet->setCellValue('H' . $row, $record['work_report'] ?: '—');
            $sheet->setCellValue('I' . $row, $record['keterangan'] ?: '—');

            // Center align columns
            $sheet->getStyle("A{$row}:I{$row}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            
            // Color row based on status
            $statusColors = [
                'hadir' => 'FFDCFCE7',
                'terlambat' => 'FFFEF3C7',
                'izin' => 'FFE0F2FE',
                'alpha' => 'FFFEE2E2',
                'libur' => 'FFF1F5F9',
            ];

            $statusKey = strtolower($record['status']);
            if (isset($statusColors[$statusKey])) {
                $sheet->getStyle("A{$row}:I{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($statusColors[$statusKey]);
            }

            $row++;
        }

        // Auto size columns
        foreach (range('A', 'I') as $columnID) {
            $sheet->getColumnDimension($columnID)->setAutoSize(true);
        }
    }
}
