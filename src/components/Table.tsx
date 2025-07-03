import React, { useEffect, useState } from "react";
import { MONTHS } from '../utils/date';

const getCurrentMonthIndex = () => new Date().getMonth();

function getCycledMonths(start: number) {
	return Array.from({ length: 6 }, (_, i) => (start + i) % 12);
}

interface TableProps {
	year: number;
	onYearChange?: (year: number) => void;
	years?: number[];
}

export default function Table({ year, onYearChange, years = [2020, 2021, 2022, 2023, 2024, 2025] }: TableProps) {
	const [data, setData] = useState<any>(null);
	const [startMonth, setStartMonth] = useState(getCurrentMonthIndex());

	useEffect(() => {
		fetch("https://3snet.co/js_test/api.json")
			.then(res => res.json())
			.then(setData);
	}, []);

	if (!data) return <div className="text-center py-10">Загрузка...</div>;

	const visibleMonths = getCycledMonths(startMonth);

	const handlePrev = () => setStartMonth((prev) => (prev - 1 + 12) % 12);
	const handleNext = () => setStartMonth((prev) => (prev + 1) % 12);

	return (<div className="p-4">
			<div className="flex items-center mb-4">
				<button onClick={handlePrev} className="p-2 border rounded mr-2">←</button>
				<button onClick={handleNext} className="p-2 border rounded">→</button>
				<select
					value={year}
					onChange={e => onYearChange && onYearChange(Number(e.target.value))}
					className="ml-4 border rounded px-2 py-1 font-bold"
				>
					{years.map(y => (
						<option key={y} value={y}>{y}</option>
					))}
				</select>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-full border text-sm">
					<thead>
						<tr>
							<th className="border px-2 py-1 bg-gray-50">Менеджер</th>
							{visibleMonths.map(idx => (
								<th key={idx} className="border px-2 py-1 bg-gray-50">{MONTHS[idx]}</th>
							))}
						</tr>
					</thead>
					<tbody>
						<tr className="font-bold bg-gray-100">
							<td className="border px-2 py-1">Всего (План)</td>
							{visibleMonths.map(idx => (
								<td key={idx} className="border px-2 py-1">
									Доход: ${data.data.total[idx]?.plan.income ?? "-"}<br />
									Партнёры: {data.data.total[idx]?.plan.activePartners ?? "-"}
								</td>
							))}
						</tr>
						<tr className="font-bold bg-gray-100">
							<td className="border px-2 py-1">Всего (Факт)</td>
							{visibleMonths.map(idx => (
								<td key={idx} className="border px-2 py-1">
									Доход: ${data.data.total[idx]?.fact.income ?? "-"}<br />
									Партнёры: {data.data.total[idx]?.fact.activePartners ?? "-"}
								</td>
							))}
						</tr>
						{data.data.table.map((admin: any) => (
							<React.Fragment key={admin.id}>
								<tr className="bg-white">
									<td className="border px-2 py-1 font-semibold" rowSpan={2}>{admin.adminName}</td>
									{visibleMonths.map(idx => (
										<td key={idx} className="border px-2 py-1">
											Доход (План): ${admin.months[idx]?.plan?.income ?? "-"}<br />
											Доход (Факт): ${admin.months[idx]?.fact?.income ?? "-"}
										</td>
									))}
								</tr>
								<tr className="bg-white">
									{/* пустая ячейка для имени */}
									{visibleMonths.map(idx => (
										<td key={idx} className="border px-2 py-1">
											Партнёры (План): {admin.months[idx]?.plan?.activePartners ?? "-"}<br />
											Партнёры (Факт): {admin.months[idx]?.fact?.activePartners ?? "-"}
										</td>
									))}
								</tr>
							</React.Fragment>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}