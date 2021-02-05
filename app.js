const { readCSV } = require('./csvhelper');
const {AvgSP,PercentagePerMake,PercentagesPerMakeTablePrint} = require('./reporthelper');
const _ = require('lodash');

const listingsPath = (__dirname,'listings.csv');
const contactsPath = (__dirname,'contacts.csv');
(
    async ()=>{
        const listingsData = await readCSV(listingsPath);
        const contactsData = await readCSV(contactsPath);
        
        //Calculate Average Listing Selling Price per Seller Type
        const avgListingbyPrivate = AvgSP(listingsData,"private");
        const avgListingbyOther = AvgSP(listingsData,"other");
        const avgListingbyDealer = AvgSP(listingsData,"dealer");
        const averageBySellerType = [
            {
                sellerType:"private",
                avg:"€"+" "+avgListingbyPrivate.toLocaleString("es-ES", {minimumFractionDigits: 2})+"-"
            },
            {
                sellerType:"dealer",
                avg:"€"+" "+avgListingbyDealer.toLocaleString("es-ES", {minimumFractionDigits: 2})+"-"
            },
            {
                sellerType:"other",
                avg:"€"+" "+avgListingbyOther.toLocaleString("es-ES", {minimumFractionDigits: 2})+"-"
            }
        ];
        console.table(averageBySellerType)
        //------------------------------------------------------------------------
         
        //Percentual distribution of available cars by Make
        const percentagesPerMake = PercentagePerMake(listingsData);
        console.table(percentagesPerMake);
        //-------------------------------------------------------------------------
        
        
        //Average price of the 30% most contacted listings
        const groupedContactedListings = _.groupBy(contactsData,'listing_id');
        const contactsPerListing = Object.entries(groupedContactedListings).map(([key,list])=>({
            id: key,
            length: list.length
        }))
        
        const sortedcontactsPerListings = _.sortBy(contactsPerListing, ['length']);
        
        const thirtyPercentListings = _.takeRight(sortedcontactsPerListings, Math.round(sortedcontactsPerListings.length * 0.30))    
        const JoinedTable = thirtyPercentListings.map(({id: listId})=> Number(listingsData.find(({id})=> id === listId).price))
        const average = _.sum(JoinedTable) / JoinedTable.length;
        console.log("Average price of the 30% most contacted listings:")
        console.log("€"+" "+average.toLocaleString("es-ES", {minimumFractionDigits: 2})+"-");
        //--------------------------------------------------------------------------
           
        //The Top 5 most contacted listings per Month

        
        const contactsInMonth = contactsData.map(item => ({...item, month_year: `${new Date(Number(item.contact_date)).getMonth()} - ${new Date(Number(item.contact_date)).getFullYear()}`}))
    
        const groupedData = _.groupBy(contactsInMonth,'month_year');
        const result = Object.entries(groupedData).map(([ key,list ]) => {
            const groupedList = _.groupBy(list, 'listing_id');
            
            const data1 = Object.entries(groupedList).map(([id, arr]) => ({id, length: arr.length}))
            const data1Sorted = _.sortBy(data1, 'length');
            const requiredData = _.takeRight(data1Sorted, 5)
            
            const mappedData = requiredData.map(({id, length}, index) => ({
            ranking: index + 1,
            contactsPerMonth: length,
            ...listingsData.find(item => item.id === id)
        }))
            
            return {
                month: key,
            data: mappedData,
            }
        })
        console.log("The Top 5 most contacted listings per Month:")
        result.forEach((d)=>{
            console.log()
            console.table(d.data);
        });

    }
)()




