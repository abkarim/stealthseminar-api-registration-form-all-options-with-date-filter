// Webinar id
const webinarShortId = ''; // Replace with you webinar short id
// Get timezone
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// initial country 
const initialCountry = 'us'; // Applied to country and number field
// Get elements
const nameField = document.getElementById('name');
const nameFieldContainer = document.querySelector('.name-container');
const emailField = document.getElementById('email');
const timeField = document.getElementById('time')
const emCheckbox = [...document.querySelectorAll('input[name="eu-member"]')];
const gdprMainContainer = document.querySelector('.gdpr-main-container');
const gdprContainer = document.getElementById('gdpr-container');
const gdprCheckbox = document.getElementById('gdpr-agree');
const smsCheckbox = document.getElementById('sms-alert');
const smsAlertContainer = document.querySelector('.sms-alert-container');
const numberInputContainer = document.getElementById('number-input-container')
const numberField = document.querySelector('input[type=tel]');
const countryField = document.getElementById('country');
const countryFieldContainer = document.querySelector('.country-container');
const form = document.querySelector('form');
const countrySelector = document.getElementById('country');
const customFieldsContainer = document.querySelector('.custom-fields-container');
const submitButton = document.querySelector('.submit-button');
const dateFilterElements = {
    yearContainer: document.querySelector('.year'),
    year: document.getElementById('year'),
    monthContainer: document.querySelector('.month'),
    month: document.getElementById('month'),
    dayContainer: document.querySelector('.day'),
    day: document.getElementById('day'),
    dateContainer: document.querySelector('.date'),
    date: document.getElementById('date'),
    meridiemContainer: document.querySelector('.meridiem'),
    meridiem: document.getElementById('meridiem'),
}

// Break element
var br = document.createElement('br');

// Handlers
const handler = {
    fields: {},
    custom: [], // Name of custom field 
    removeFiltered: false, // ex: Remove AM from date if user selected AM in filtering and same for all available formatting options
};

// Date filter // Only available date will be filter
const dateFilter = {
    year: true, // 2000 ...
    month: true, // January ...
    date: true, // 01, 02 ...
    day: true, // Sunday ...
    meridiem: true // AM PM
}

// Handle filtered date
const dateTimeHandler = {
    total: [],
    yearFiltered: [],
    monthFiltered: [],
    daysFiltered: [],
    dateFiltered: [],
    meridiemFiltered: [],
    format: '',
}

// Tracking value from url
const urlParameter = new URL(window.location.href);
const urlParams = {
    v1: urlParameter.searchParams.get('v1'),
    v2: urlParameter.searchParams.get('v2'),
    v3: urlParameter.searchParams.get('v3'),
    v4: urlParameter.searchParams.get('v4'),
    v5: urlParameter.searchParams.get('v5'),
    utm_source: urlParameter.searchParams.get('utm_source'),
    utm_content: urlParameter.searchParams.get('utm_content'),
    utm_term: urlParameter.searchParams.get('utm_term'),
    utm_campaign: urlParameter.searchParams.get('utm_campaign'),
    utm_medium: urlParameter.searchParams.get('utm_medium'),
}

//* All filed will be enabled or disabled automatically by event configuration
// To enable fields forcefully set filed = true //? And forcefully added field will be required automatically
const fields = {
    name: false,
    gdprConsent: false,
    smsAlert: false,
    country: false,
}

//* Configure number input
var iti = intlTelInput(numberField, {
    initialCountry,
    preferredCountries: [],
    utilsScript:
        "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
})

/**
 * Show name filed
 * @param {Boolean} required 
 */
function showName(required) {
    // Visible name field
    nameFieldContainer.hidden = false;
    if (required) nameField.required = true; // Set required to name
    handler.fields.name = true; // Add field
}

/**
 * Show gdpr filed
 * @param {Boolean} required 
 */
function showGDPR(required = false) {
    // Show gdpr filed
    gdprMainContainer.hidden = false;
    if (required) emCheckbox.forEach(item => item.required = true);// Set required to member of eu
    // Set event
    emCheckbox.forEach(item => item.addEventListener('change', () => {
        // Is eu member
        const memberOfEU = document.querySelector('input[name="eu-member"]:checked').value === 'yes';
        if (memberOfEU) {
            gdprContainer.hidden = false
            gdprCheckbox.required = true;
        } else {
            gdprContainer.hidden = true
            gdprCheckbox.required = false;
        }
    }))
    handler.fields.gdprConsent = true; // Add field
}

/**
 * Show sms alert
 * @param {Boolean} required 
 */
function showSMSAlert(required = false) {
    // VIsible sms field
    smsAlertContainer.hidden = false;
    smsCheckbox.addEventListener('click', () => {
        // Is checked
        if (smsCheckbox.checked) {
            numberInputContainer.hidden = false;
            numberField.required = true;
        } else {
            numberInputContainer.hidden = true;
            numberField.required = false;
        }
    })
    if (required) smsCheckbox.required = true;
    handler.fields.smsAlert = true;  // Add field
}

/**
 * Show country
 * @param {Boolean} required 
 */
function showCountry(required = false) {
    // Show country 
    countryFieldContainer.hidden = false;
    //* Configure country names
    const country = window.intlTelInputGlobals.getCountryData();
    country.forEach(country => {
        // Prepare option element and append to country list selector
        const element = document.createElement('option');
        element.value = country.iso2.toUpperCase();
        element.textContent = country.name;
        countrySelector.appendChild(element);
    })
    // Set Initial country
    countrySelector.value = initialCountry.toUpperCase();
    if (required) countryField.required = true; // Mark as required
    // Add field
    handler.custom.push({
        type: 'select',
        name: 'country'
    });
}

/**
 * Append option to select
 * @param {String} time 
 * @param {String} text 
 * @param {Element} element
 */
function appendOption(value, text, parentElement) {
    // Create element
    const element = document.createElement('option');
    element.value = value;
    element.textContent = text;
    parentElement.appendChild(element)
}

/**
 * Remove options from select element
 * @param {Number} skip  
 * @param {Element} element
 */
function removeOption(skip, parentElement) {
    const elements = [...parentElement.children]; // Get all elements
    // Skip and remove elements
    elements.splice(skip).forEach(element => element.remove());
}

/**
 * Show message to user
 * @param {String} text 
 * @param {Boolean} success 
 */
function showMessage(text, success = false) {
    // Remove previous element if found
    const prevElement = document.querySelector('.message');
    if (prevElement) prevElement.remove();
    const element = document.createElement('div');
    element.setAttribute('class', `message ${success === false ? 'error' : ''}`);
    element.textContent = text;
    document.body.appendChild(element)
    // Clear message element
    element.addEventListener('click', (e) => e.target.remove()); // Remove 
}

//* Custom fields
/**
 * Create text field
 * @param {String} name input name
 * @param {String} placeholder 
 * @param {Boolean} required
 */
function customTextField(name, placeholder, required) {
    // Create element
    const container = document.createElement('div');
    const element = document.createElement('input');
    element.setAttribute('type', 'text');
    element.setAttribute('placeholder', placeholder);
    element.setAttribute('name', name);
    element.required = required;
    // Append to custom fields section
    container.appendChild(element);
    customFieldsContainer.appendChild(container);
    // Add to customs
    handler.custom.push({
        type: 'text',
        name
    });
}

/**
 * Create select element
 * @param {String} name
 * @param {String} label 
 * @param {Array} option
 * @param {Boolean} required
 */
function customSelectField(name, labelText, optionArr, required) {
    // Create element
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    // Create select element
    const element = document.createElement('select');
    element.setAttribute('name', name);
    element.required = required;
    // Default options
    const select_element = document.createElement('option');
    select_element.setAttribute('disabled', true);
    select_element.setAttribute('selected', true);
    select_element.textContent = 'Select an option';
    select_element.value = '';
    element.appendChild(select_element);
    // Append options
    optionArr.forEach(option => {
        const option_element = document.createElement('option');
        option_element.value = option.value;
        option_element.textContent = option.label;
        element.appendChild(option_element)
    })
    // Append to custom fields section
    container.appendChild(label);
    container.appendChild(element);
    customFieldsContainer.appendChild(container);
    // Add to customs
    handler.custom.push({
        type: 'select',
        name
    });
}

/**
 * Create checkbox element
 * @param {String} name
 * @param {String} label 
 * @param {Array} option
 * @param {Boolean} required
 */
function customCheckboxField(name, labelText, optionArr, required) {
    // Create element
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    // Append to custom fields section
    container.appendChild(label);
    container.appendChild(br.cloneNode());
    // Append checkboxes
    optionArr.forEach((option, index) => {
        // Check box
        const id = `${name}-${index}`;
        const checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.name = name;
        checkbox.value = option.value;
        checkbox.textContent = option.label;
        checkbox.required = required;
        checkbox.id = id;
        container.appendChild(checkbox);
        // Label
        const label = document.createElement('label');
        label.textContent = option.label
        label.setAttribute('for', id);
        container.appendChild(label);
        // Break
        container.appendChild(br.cloneNode());
        // Add to customs
        handler.custom.push({
            type: 'checkbox',
            name: name
        });
    })
    customFieldsContainer.appendChild(container);
}

/**
 * Create radio element
 * @param {String} name
 * @param {String} label 
 * @param {Array} option
 * @param {Boolean} required
 */
function customRadioField(name, labelText, optionArr, required) {
    // Create element
    const container = document.createElement('div');
    const label = document.createElement('label');
    label.textContent = labelText;
    // Append to custom fields section
    container.appendChild(label);
    container.appendChild(br.cloneNode());
    // Append checkboxes
    optionArr.forEach((option, index) => {
        // Check box
        const id = `${name}-${index}`;
        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.name = name;
        radio.value = option.value;
        radio.textContent = option.label;
        radio.required = required;
        radio.id = id;
        container.appendChild(radio);
        // Label
        const label = document.createElement('label');
        label.textContent = option.label
        label.setAttribute('for', id);
        container.appendChild(label);
        // Break
        container.appendChild(br.cloneNode());
        // Add to customs
        handler.custom.push({
            type: 'radio',
            name
        });
    })
    customFieldsContainer.appendChild(container);
}

/**
 * Create hidden field
 * @param {String} name input name
 * @param {String} value value
 */
function customHiddenField(name, value) {
    // Create element
    const container = document.createElement('div');
    const element = document.createElement('input');
    element.setAttribute('type', 'hidden');
    element.setAttribute('name', name);
    element.value = value;
    // Append to custom fields section
    container.appendChild(element);
    customFieldsContainer.appendChild(container);
    // Add to customs
    handler.custom.push({
        type: 'hidden',
        name
    });
}
/**
 * Custom fields add function
 * These fields will be added to last of the form
 * This function will be called automatically after adding form fields in api request
 */
function addCustomFields() {
    //* Check these functions inside for more details
    // customTextField("name", "label", true); // Text field
    // customSelectField("name", "label", [{label: "label", value: "value"}], true); // Select
    // customCheckboxField("name", "label", [{label: "label", value: "value"}], true); // checkbox
    // customRadioField("name", "label", [{label: "label", value: "value"}], true); // radio
    // customHiddenField("name", "value" ); // Hidden

    //* Call function n time to get n number of custom field // where n is a Number 
}

/**
 * Year filter function
 */
function filterYear() {
    // Get year
    const year = dateFilterElements.year.value;
    // update filtered date
    if (year === 'any') {
        dateTimeHandler.yearFiltered = dateTimeHandler.total;
    } else {
        // Get dates that match year
        const matchDates = dateTimeHandler.total.filter(datetime => moment(datetime).isSame(year, 'year'));
        dateTimeHandler.yearFiltered = matchDates;
    }
    // Update month
    setAllMonths();
    // Update all days
    setAllDays();
    // Update all dates
    setAllDates();
    // Update all meridiem
    setAllMeridiem();
    setFinalDateTime();
}

/**
 * Month filter function
 */
function filterMonth() {
    // Get month
    const month = dateFilterElements.month.value;
    if (month === 'any') {
        dateTimeHandler.monthFiltered = dateTimeHandler.yearFiltered;
    } else {
        // Get dates that match month
        const matchDates = dateTimeHandler.yearFiltered.filter(datetime => moment(datetime).format('MMMM') === month);
        // update filtered date
        dateTimeHandler.monthFiltered = matchDates;
    }
    // Update all days
    setAllDays();
    // Update all dates
    setAllDates();
    // Update all meridiem
    setAllMeridiem();
    setFinalDateTime();
}

/**
 * Day filter function
 */
function filterDay() {
    // Get day
    const day = dateFilterElements.day.value;
    if (day === 'any') {
        dateTimeHandler.daysFiltered = dateTimeHandler.monthFiltered
    } else {
        // Get dates that match day
        const matchDates = dateTimeHandler.monthFiltered.filter(datetime => moment(datetime).format('dddd') === day);
        // update filtered date
        dateTimeHandler.daysFiltered = matchDates;
    }
    // Update all dates
    setAllDates();
    // Update all meridiem
    setAllMeridiem();
    setFinalDateTime();
}

/**
 * Date filter function
 */
function filterDate() {
    // Get date
    const date = dateFilterElements.date.value;
    if (date === 'any') {
        dateTimeHandler.dateFiltered = dateTimeHandler.monthFiltered
    } else {
        // Get dates that match dates
        const matchDates = dateTimeHandler.daysFiltered.filter(datetime => moment(datetime).format('DD') == date);
        // update filtered date
        dateTimeHandler.dateFiltered = matchDates;
    }
    // Update all meridiem
    setAllMeridiem();
    setFinalDateTime();
}

/**
 * Meridiem filter function
 */
function filterMeridiem() {
    // Get meridiem
    const meridiem = dateFilterElements.meridiem.value;
    if (meridiem === 'any') {
        dateTimeHandler.meridiemFiltered = dateTimeHandler.dateFiltered
    } else {
        // Get meridiem that match day
        const matchMeridiem = dateTimeHandler.dateFiltered.filter(datetime => moment(datetime).format('A') === meridiem);
        // update filtered meridiem
        dateTimeHandler.meridiemFiltered = matchMeridiem;
    }
    // Update all meridiem
    setFinalDateTime();
}

/**
 * Set all years
 * Add years to year selector
 */
function setAllYears() {
    // Destruct year from total dateTime
    const year = [];
    dateTimeHandler.total.forEach(time => {
        const data = moment(time).format('YYYY');
        if (!year.includes(data)) year.push(data)
    })
    // Remove previous options
    removeOption(1, dateFilterElements.year);
    year.forEach(y => appendOption(y, y, dateFilterElements.year))
}

/**
 * Set all months
 * Add months to month selector
 */
function setAllMonths() {
    dateTimeHandler.monthFiltered = [];
    // Destruct month from filtered time
    const month = [];
    dateTimeHandler.yearFiltered.forEach(time => {
        dateTimeHandler.monthFiltered.push(time)
        const data = moment(time).format('MMMM');
        if (!month.includes(data)) month.push(data)
    })
    // Remove previous options
    removeOption(1, dateFilterElements.month);
    month.forEach(y => appendOption(y, y, dateFilterElements.month))
}

/**
 * Set all days
 * Add days to day selector
 */
function setAllDays() {
    dateTimeHandler.daysFiltered = [];
    // Destruct day from filtered time
    const day = [];
    dateTimeHandler.monthFiltered.forEach(time => {
        dateTimeHandler.daysFiltered.push(time)
        const data = moment(time).format('dddd');
        if (!day.includes(data)) day.push(data)
    })
    // Remove previous options
    removeOption(1, dateFilterElements.day);
    sortDays(day).forEach(y => appendOption(y, y, dateFilterElements.day))
}

/**
 * Set all dates
 * Add dates to date selector
 */
function setAllDates() {
    dateTimeHandler.dateFiltered = [];
    // Destruct date from filtered time
    const date = [];
    dateTimeHandler.daysFiltered.forEach(time => {
        dateTimeHandler.dateFiltered.push(time)
        const data = moment(time).format('DD');
        if (!date.includes(data)) date.push(data)
    })
    // Remove previous options
    removeOption(1, dateFilterElements.date);
    date.sort((a, b) => a - b).forEach(y => appendOption(y, y, dateFilterElements.date))
}

/**
 * Set all meridiem
 * Add meridiem to meridiem selector
 */
function setAllMeridiem() {
    dateTimeHandler.meridiemFiltered = []
    // Destruct meridiem from filtered time
    const meridiem = [];
    dateTimeHandler.dateFiltered.forEach(time => {
        dateTimeHandler.meridiemFiltered.push(time)
        const data = moment(time).format('A');
        if (!meridiem.includes(data)) meridiem.push(data)
    })
    // Remove previous options
    removeOption(1, dateFilterElements.meridiem);
    meridiem.forEach(y => appendOption(y, y, dateFilterElements.meridiem))
}

/**
 * Set final date
 */
function setFinalDateTime() {
    // Remove previous options
    removeOption(1, timeField);
    dateTimeHandler.meridiemFiltered.forEach(time => {
        // Prepare date
        let dateTime = '';
        if (dateTimeHandler.format.type === 'separate') {
            // Separate time
            const date = moment(time).format(dateTimeHandler.format.date_format); // Date
            const tm = moment(time).format(dateTimeHandler.format.time_format); // Time
            // Update date time
            dateTime = `${date}${dateTimeHandler.format.separator}${tm}`;
        } else {
            // Combined date time
            dateTime = moment(time).format(dateTimeHandler.format.combined_format);
        }

        // Remove filtered text
        if (handler.removeFiltered) {
            if (dateFilterElements.year.value !== "any") dateTime = dateTime.replace(/,?.?\d{4}/, '');
            if (dateFilterElements.month.value !== "any") dateTime = dateTime.replace(/(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) /i, '');
            if (dateFilterElements.day.value !== 'any') dateTime = dateTime.replace(/(?:sun(?:day)?|mon(?:day)?|tue(?:sday)?|wed(?:nesday)?|thu(?:rsday)?|fri(?:day)?|sat(?:urday)?)( |,)?/i, '');
            if (dateFilterElements.date.value !== 'any') dateTime = dateTime.replace(/\d.,?/, '');
            if (dateFilterElements.meridiem.value !== 'any') dateTime = dateTime.replace(/(AM|PM)/i, '');
        }
        appendOption(time, dateTime, timeField); // Append time

    })
    if (handler.yesterdays_now) {
        appendOption("2000-02-25T00:00:00.000Z", "WATCH YESTERDAY'S WEBINAR NOW", timeField);
    }
}

// Sort days
function sortDays(days) {
    var day_of_week = new Date().getDay();
    var list = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var sorted_list = list.slice(day_of_week).concat(list.slice(0, day_of_week));
    return days.sort(function (a, b) { return sorted_list.indexOf(a) > sorted_list.indexOf(b); });
}


/**
 * Submit form
 */
function submit(e) {
    e.preventDefault();
    // Validate webinar time
    if (!moment().isBefore(moment(timeField.value))) {
        if ("2000-02-25T00:00:00.000Z" !== timeField.value) {
            return showMessage("Please select a future time");
        }
    }
    // Validate number
    if (smsCheckbox.checked && !iti.isValidNumber()) return showMessage("Please input a valid number with correct format");
    // Prepare data
    const data = {
        start_time: timeField.value,
        email: emailField.value,
        timezone: timeZone,
        linkParams: {
            ...urlParams
        },
        yesterdays_now: "2000-02-25T00:00:00.000Z" === timeField.value
    }
    // Append conditional data
    if (handler.fields.name) data.name = nameField.value; // Name 
    if (handler.fields.smsAlert) data.sms_number = iti.getNumber(); // Mobile number
    if (handler.fields.gdprConsent) data.gdprConsentReceived = true // GDPR consent
    // Handle custom fields
    const cField = {};
    handler.custom.forEach(customObj => {
        // Text filed
        if (customObj.type === "text") {
            cField[customObj.name] = document.querySelector(`input[type=text][name='${customObj.name}']`).value;
        } else if (customObj.type === "select") {
            // Select filed
            cField[customObj.name] = document.querySelector(`select[name='${customObj.name}']`).value;
        } else if (customObj.type === 'checkbox') {
            // Checkbox field
            cField[customObj.name] = document.querySelector(`input[type=checkbox][name='${customObj.name}']`).value;
        } else if (customObj.type === 'radio') {
            // Checkbox field
            cField[customObj.name] = document.querySelector(`input[type=radio][name='${customObj.name}']`).value;
        } else if (customObj.type === 'hidden') {
            // Checkbox field
            cField[customObj.name] = document.querySelector(`input[type=hidden][name='${customObj.name}']`).value;
        }
    })
    // Append custom field to data if not empty
    if (Object.keys(cField).length > 0) data.customFields = cField;
    // DIsable submit button
    submitButton.classList.add('disabled');
    // Post request
    axios
        .post(`https://api.joinnow.live/webinars/${webinarShortId}/registration`, data, {
            contentType: 'application/json'
        })
        .then(response => {
            const { data } = response; // Destruct data
            // Show message
            showMessage('Redirecting...', true)
            // Redirect user
            if (data.yesterdays_now) {
                window.location = `https://joinnow.live/r/${data.short_id}?id=${data.attendee.short_id}`;
            } else {
                window.location = `https://joinnow.live/t/${data.webinar_short_id}?id=${data.attendee.short_id}`;
            }
        })
        .catch((e) => {
            // console.log(e); // Error
            showMessage("Something went wrong, please try again later");
            // Enable submit button
            submitButton.classList.remove('disabled')
        })
}

form.addEventListener('submit', submit);

// Get webinar registration data
axios
    .get(`https://api.joinnow.live/webinars/${webinarShortId}/registration-information?timezone=${timeZone}`)
    .then(response => {
        // Destruct data
        const { data } = response;
        // Update document title
        document.title = data.title;
        moment.locale(data.date_locale); // Set locale
        dateTimeHandler.format = data.datetime_format;
        // Handle upcoming times
        data.upcoming_times.forEach(time => {
            dateTimeHandler.total.push(time);
            dateTimeHandler.yearFiltered.push(time);
            dateTimeHandler.monthFiltered.push(time);
            dateTimeHandler.daysFiltered.push(time);
            dateTimeHandler.dateFiltered.push(time);
            dateTimeHandler.meridiemFiltered.push(time);
        })
        // Handle yesterdays webinar now
        if (data.yesterdays_now) {
            handler.yesterdays_now = true; // Update handler
        }
        // Dynamically handle field
        data.registration_schema.fields.forEach(field => {
            // Is open
            if (!field.disabled) {
                switch (field.type) {
                    case 'Name':
                        showName(field.required);
                        break;
                    case "GdprConsent":
                        showGDPR(field.required);
                        break;
                    case "SmsNumber":
                        showSMSAlert(field.required);
                        break;
                    // Custom fields
                    case "Country":
                        showCountry(field.required);
                        break;
                    case 'Text':
                        customTextField(field.name, field.label, field.required);
                        break;
                    case "Select":
                        customSelectField(field.name, field.label, field.options, field.required);
                        break;
                    case "Checkboxes":
                        customCheckboxField(field.name, field.label, field.options, field.required);
                        break;
                    case "RadioButtons":
                        customRadioField(field.name, field.label, field.options, field.required);
                        break;
                    default:
                }
            }
        })
        addCustomFields(); // Add custom fields
        handleDateFiltering(); // Handle date filtering options
    })
    .catch((e) => {
        // console.log(e); // Error
        showMessage('Something went wrong, please try again later');
    })

//* Handle forcefully field
if (fields.name) showName(true);
if (fields.gdprConsent) showGDPR(true);
if (fields.smsAlert) showSMSAlert(true);
if (fields.country) showCountry(true);

// Handle date filtering
function handleDateFiltering() {
    if (dateFilter.year) {
        dateFilterElements.yearContainer.hidden = false;
        dateFilterElements.year.addEventListener('change', filterYear);
    }
    if (dateFilter.month) {
        dateFilterElements.monthContainer.hidden = false;
        dateFilterElements.month.addEventListener('change', filterMonth);
    }
    if (dateFilter.day) {
        dateFilterElements.dayContainer.hidden = false;
        dateFilterElements.day.addEventListener('change', filterDay);
    }
    if (dateFilter.date) {
        dateFilterElements.dateContainer.hidden = false;
        dateFilterElements.date.addEventListener('change', filterDate);
    }
    if (dateFilter.meridiem) {
        dateFilterElements.meridiemContainer.hidden = false;
        dateFilterElements.meridiem.addEventListener('change', filterMeridiem);
    }
    setAllYears();
    setAllMonths();
    setAllDays();
    setAllDates();
    setAllMeridiem();
    setFinalDateTime();
}