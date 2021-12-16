using Core.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Infrastructure.Data
{
    public class StoreContextSeed
    {
        public static async Task SeedAsync(StoreContext context, ILoggerFactory loggerFactory)
        {
            try
            {
                if (!context.ProductBrands.Any())
                {
                    string brandsData = File.ReadAllText("../Infrastructure/Data/SeedData/brands.json");
                    List<ProductBrand> brands = JsonSerializer.Deserialize<List<ProductBrand>>(brandsData);

                    await context.ProductBrands.AddRangeAsync(brands);

                    await context.SaveChangesAsync();
                }

                if (!context.ProductTypes.Any())
                {
                    string typesData = File.ReadAllText("../Infrastructure/Data/SeedData/types.json");
                    List<ProductType> types = JsonSerializer.Deserialize<List<ProductType>>(typesData);

                    await context.ProductTypes.AddRangeAsync(types);

                    await context.SaveChangesAsync();
                }

                if (!context.Products.Any())
                {
                    string productsData = File.ReadAllText("../Infrastructure/Data/SeedData/products.json");
                    List<Product> products = JsonSerializer.Deserialize<List<Product>>(productsData);

                    await context.Products.AddRangeAsync(products);

                    await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                ILogger logger = loggerFactory.CreateLogger<StoreContextSeed>();
                logger.LogError(ex, "Error during seeding data!");
            }
        }
    }
}
