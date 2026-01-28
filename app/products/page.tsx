import { Suspense } from 'react';
import ProductPage from "../components/Products/productPage";

export default function ProductsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ProductPage />
      </Suspense>
    </div>
  );
}