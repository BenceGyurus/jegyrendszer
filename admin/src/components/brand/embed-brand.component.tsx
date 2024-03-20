import "../../css/brand.css";

type typeOfBrandParams = {
    image : string,
    link : string,
    brandName? : string
}

const Brand = ({image, link, brandName}:typeOfBrandParams)=>{
    return (
        <a href={link} className = "shared-link" target="_blank">
            <img src={image} alt={brandName} className = "shared-link-image" />
        </a>
    )
}

export default Brand;