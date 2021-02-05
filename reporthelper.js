//Helper functions
//-------------------------------------------------------------
function comparePercentagesPerMake(a,b)
{
    let percA = a.percentage;
    let percB = b.percentage;
    if(percA > percB)
    return 1
    else if(percA < percB)
    return -1
}
function PercentagesPerMakeTablePrint(data)
{
    let tableString =
    `Percentual distribution of available cars by Make
        =================
        Make : Percentage  
        =================
        `
    data.forEach((entry)=>{
        tableString=tableString+
        `${entry.make} : ${entry.percentage}%

        `
    });
    tableString=tableString+
    `===================`;
    return tableString;
}

//Calculations
//-------------------------------------------------------------
function AvgSP (data,sellerType){
    const listingsBySellerType = data.filter(listing=>listing["seller_type"]==sellerType);
    const averageBySellerType = listingsBySellerType.reduce((sum,value)=>{
        return sum + parseFloat(value["price"]);
    },0);
    return (averageBySellerType/listingsBySellerType.length).toLocaleString("es-ES", {minimumFractionDigits: 3});
}
//---------------------------------------------------------------

function PercentagePerMake(data){
    let PercentagesPerMake = [];
    const TotalListings = data.length;
    const uniqueMakes = [...new Set(data.map(item=>item["make"]))];
    uniqueMakes.forEach((currMake)=>{
        const numItems = data.filter(c => c["make"]==currMake).length;
        PercentagesPerMake.push({"make":currMake,
                                 "percentage":(numItems*100/TotalListings).toFixed(2)+"%"});
    });
    return PercentagesPerMake.sort(comparePercentagesPerMake);
}

module.exports = {
    AvgSP: AvgSP,
    PercentagePerMake: PercentagePerMake,
    PercentagesPerMakeTablePrint: PercentagesPerMakeTablePrint
}