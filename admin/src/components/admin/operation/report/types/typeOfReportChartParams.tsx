import typeOfReport from "./typeOfReport";

export default interface typeOfReportChartParams{
    data : Array<typeOfReport>,
    startDate : Date,
    endDate : Date,
    numberOfGroups : number,
    objectKey : string,
    secondKey? : string
};