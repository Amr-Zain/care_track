
export const userTypes = [ 'patient' , 'doctor' , 'nurse' , 'receptionist' ];

export function calculateAge(birthday) {
  const birthDate = new Date(birthday);
  if(!birthday)return null
    const currentDate = new Date();
  
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
}
export const parseDateTime = (dateStr, timeStr) => {
  const [day, month, year] = dateStr.split('/').map(Number);
  const [time, period] = timeStr.split(' ');
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const adjustedHours = (hours % 12) + (period.toLowerCase() === 'pm' ? 12 : 0);

  return new Date(year, month - 1, day, adjustedHours, minutes, seconds).getTime();
};



const options = {
  year: 'numeric',
  month: 'long', // 'numeric', '2-digit', 'long', 'short', 'narrow'
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true, // Use 12-hour format
};

export const dateFormatter = new Intl.DateTimeFormat('en-US', options).format;