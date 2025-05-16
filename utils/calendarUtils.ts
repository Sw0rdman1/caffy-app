export const getMonthMatrix = (date: Date): (Date | null)[][] => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const matrix: (Date | null)[][] = [];
    let week: (Date | null)[] = [];

    // Adjusting so week starts on Monday
    const startOffset = (firstDayOfMonth.getDay() + 6) % 7;

    // Fill initial blanks
    for (let i = 0; i < startOffset; i++) {
        week.push(null);
    }

    // Fill days of month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
        const currentDate = new Date(year, month, day);
        week.push(currentDate);

        if (week.length === 7) {
            matrix.push(week);
            week = [];
        }
    }

    // Fill trailing blanks
    if (week.length > 0) {
        while (week.length < 7) {
            week.push(null);
        }
        matrix.push(week);
    }

    return matrix;
};

export const getMonthName = (date: Date): string => {
    return date.toLocaleString('default', { month: 'long' });
};
