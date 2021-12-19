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

        public ProductsWithTypesAndBrandsSpec(ProductSpecParams productParams)
            : base(x =>
                 (string.IsNullOrEmpty(productParams.Search) || x.Name.ToLower().Contains(productParams.Search))
                 &&
                 (!productParams.BrandId.HasValue || x.ProductBrandId == productParams.BrandId)
                 &&
                 (!productParams.TypeId.HasValue || x.ProductTypeId == productParams.TypeId)
            )
        {
            AddInclude(p => p.ProductBrand);
            AddInclude(p => p.ProductType);
            AddOrderBy(p => p.Name);
            ApplyPaging(productParams.PageSize * (productParams.PageIndex - 1), productParams.PageSize);

            if (!string.IsNullOrEmpty(productParams.Sort))
            {
                switch (productParams.Sort)
                {
                    case "priceAsc":
                        AddOrderBy(p => p.Price);
                        break;
                    case "priceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;
                    default:
                        AddOrderBy(p => p.Name);
                        break;
                }
            }
        }
    }
}
