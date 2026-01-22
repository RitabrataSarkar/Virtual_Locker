import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Filter, ArrowUpDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

export type SortOption = 'name' | 'date' | 'size';
export type SortOrder = 'asc' | 'desc';
export type FilterOption = 'all' | 'image' | 'document' | 'video' | 'audio' | 'archive' | 'code';

interface SortFilterControlProps {
    currentSort: SortOption;
    currentOrder: SortOrder;
    currentFilter: FilterOption;
    onSortChange: (sort: SortOption) => void;
    onOrderChange: (order: SortOrder) => void;
    onFilterChange: (filter: FilterOption) => void;
}

export function SortFilterControl({
    currentSort,
    currentOrder,
    currentFilter,
    onSortChange,
    onOrderChange,
    onFilterChange,
}: SortFilterControlProps) {

    const toggleOrder = () => {
        onOrderChange(currentOrder === 'asc' ? 'desc' : 'asc');
    };

    const sortLabels: Record<SortOption, string> = {
        name: 'Name',
        date: 'Date Modified',
        size: 'Size',
    };

    const filterLabels: Record<FilterOption, string> = {
        all: 'All Files',
        image: 'Images',
        document: 'Documents',
        video: 'Videos',
        audio: 'Audio',
        archive: 'Archives',
        code: 'Code',
    };

    return (
        <div className="flex items-center gap-2 mb-4">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[140px] h-9 justify-between">
                            {sortLabels[currentSort]}
                            <ArrowUpDown className="h-4 w-4 opacity-50" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                            <DropdownMenuItem
                                key={key}
                                onClick={() => onSortChange(key)}
                                className={currentSort === key ? "bg-accent" : ""}
                            >
                                {sortLabels[key]}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Order Toggle */}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={toggleOrder}
                    title={currentOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                    {currentOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-2" />

            {/* Filter Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant={currentFilter === 'all' ? 'outline' : 'secondary'} className="h-9 gap-2">
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">
                            {currentFilter === 'all' ? 'Filter' : filterLabels[currentFilter]}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {(Object.keys(filterLabels) as FilterOption[]).map((key) => (
                        <DropdownMenuCheckboxItem
                            key={key}
                            checked={currentFilter === key}
                            onCheckedChange={() => onFilterChange(key)}
                        >
                            {filterLabels[key]}
                        </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
