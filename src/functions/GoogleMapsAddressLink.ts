const GoogleMapsAddressLink = (address: any) => {
  if (!address) {
    return "";
  }

  const addressLink = `https://www.google.com/maps/search/
          ${address.line ? address.line?.join(", ") : ""} 
          ${address.city ?? ""} 
          ${address.state ?? ""} 
          ${address.postalCode ?? ""} 
          ${address.country ?? ""}`;

  return addressLink.replace(/\s+/g, " ");
};

export default GoogleMapsAddressLink;
