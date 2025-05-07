export const fileToDataString = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error);
      reader.onload = () => resolve(reader.result);
    });
  };

  export function timeAgo(createdAt) {
    const date = new Date(createdAt);
  
    // Get hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // hour 0 should be 12
  
    // Pad minutes with leading zero if needed
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
  
    return `${hours}:${minutesStr} ${ampm}`;
  }
  