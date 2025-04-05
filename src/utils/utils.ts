const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatCurrency = (insertedCurrency: number) => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NGN',
    });
    let currency = formatter.format(insertedCurrency).substring(3);
    if (currency.startsWith('N') && !currency.startsWith('NaN')) {
        currency = currency.substring(1, currency.length);
        currency = ' -' + currency;
    }
    if (currency.includes('.00')) {
        currency = currency.substring(0, currency.length - 3);
    }
    return currency;
};

const formatDate = (insertedDate: string) => {
    const date = new Date(insertedDate);
    const year = date.getFullYear().toString().substring(2);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const time = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    return day + ' ' + month + " '" + year + ' at ' + time;

    // 12 Nov ‘21 at 12:30PM
};

const getOS = () => {
    const userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os = 'WEB';

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Web'; //Mac
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'IOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'WEB'; //Windows
    } else if (/Android/.test(userAgent)) {
        os = 'ANDROID';
    } else if (!os && /Linux/.test(platform)) {
        os = 'WEB'; //linus
    }

    return os;
};

const calculateNumberOfDays = (
    startDate: string,
    endDate: string
  ): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    // check if number of days is negative and return 0
    // if (timeDifference < 0) return 0;

    return Math.ceil(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
  };

export { formatCurrency, getOS, formatDate, calculateNumberOfDays };
