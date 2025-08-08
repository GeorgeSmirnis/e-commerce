

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <div className="card shadow-sm h-100 border-0">
      <img
        src={product.image}
        className="card-img-top"
        alt={product.name}
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title fw-bold">{product.name}</h5>
        <p className="card-text text-muted mb-2">
          <strong>Description:</strong> {product.description}
        </p>
        <p className="card-text">
          <strong>Price:</strong> ${product.price}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;

