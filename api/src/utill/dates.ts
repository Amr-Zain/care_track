function getLastMonths(month: number) {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - month);
    return sixMonthsAgo;
}

function getLastYears(year:number) {
const today = new Date();
const lastYear = new Date(today);
lastYear.setFullYear(today.getFullYear() - year);
return lastYear;
}

export const calcDiagnoisDate = (number: number): Date=>{
    if(number ===0) return getLastMonths(6);
    else if(number ===1) return getLastYears(1);
    else if(number ===2) return getLastYears(2);
    else return getLastYears(100);
}

export function formatDate(date: Date): string {
    const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Use 24-hour format
    });
  
    return formatter.format(date).replace(',', '').replace(/\//g, '-'); 
  }


