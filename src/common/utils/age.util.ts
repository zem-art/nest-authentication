export class AgeUtil {
    /**
     * 
     * @param params  date_of_birth  format ISO 8610 | YYYY-MM-DD 
     * @returns 
     */
    static calculate_age(params:string):object {
        let birth = new Date(params);
        let today = new Date();

        // Calculate the difference in years
        let ageYears = today.getFullYear() - birth.getFullYear();

        // Calculate the difference in months
        let ageMonths = today.getMonth() - birth.getMonth();
        if (ageMonths < 0 || (ageMonths === 0 && today.getDate() < birth.getDate())) {
            ageYears--;
            ageMonths += 12;
        }

        // Calculate the difference in days
        let ageDays = today.getDate() - birth.getDate();
        if (ageDays < 0) {
            let lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            ageDays += lastMonth.getDate();
            ageMonths--;
        }
        
        let returns = {
            years: ageYears,
            months: ageMonths,
            days: ageDays
        }

        return returns
    }
}