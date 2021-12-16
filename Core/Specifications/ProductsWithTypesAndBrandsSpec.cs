using Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Text;

namespace Core.Specifications
{
    public class ProductsWithTypesAndBrandsSpec : BaseSpecification<Product>
    {
        public ProductsWithTypesAndBrandsSpec()
        {
            this.AddInclude(p => p.ProductBrand);
            this.AddInclude(p => p.ProductType);
        }
        public ProductsWithTypesAndBrandsSpec(Expression<Func<Product, bool>> criteria) : base(criteria)
        {
            this.AddInclude(p => p.ProductBrand);
            this.AddInclude(p => p.ProductType);
        }

        public ProductsWithTypesAndBrandsSpec(int id) : base(p => p.Id == id)
        {
            this.AddInclude(p => p.ProductBrand);
            this.AddInclude(p => p.ProductType);
        }
    }
}
