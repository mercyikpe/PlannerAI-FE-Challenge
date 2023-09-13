export interface Coordinate {
    x: string|number,
    y: string|number
}

export interface ChartDataset<T extends Coordinate = Coordinate> {
    label: string;
    data: T[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
}