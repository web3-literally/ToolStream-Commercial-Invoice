using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.IdentityModel.Protocols;

namespace ToolStream_Invoice.DataAccess.DBDataModels
{
    public partial class DachserContext : DbContext
    {
        public DachserContext()
        {
        }

        public DachserContext(DbContextOptions<DachserContext> options)
            : base(options)
        {
        }

        public virtual DbSet<DachserDetails> DachserDetails { get; set; }
        public virtual DbSet<DachserHeader> DachserHeader { get; set; }
        public virtual DbSet<DachserTrailer> DachserTrailer { get; set; }
        
        //Fake For Procedure
        public virtual DbSet<SearchTrailer> SearchTrailer { get; set; }
        public virtual DbSet<CreateTrailer> CreateTrailer { get; set; }
        public virtual DbSet<OrderExistStatus> OrderExistStatus { get; set; }
        public virtual DbSet<OrderUsedStatus> OrderUsedStatus { get; set; }
        public virtual DbSet<CommercialInvoice> CommercialInvoice { get; set; }
        public virtual DbSet<CommercialInvoiceHeader> CommercialInvoiceHeader { get; set; }
        public virtual DbSet<CommercialInvoiceDetail> CommercialInvoiceDetail { get; set; }
        public virtual DbSet<CommercialInvoiceFooter> CommercialInvoiceFooter { get; set; }

        /*
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Data Source=185.220.176.36,3171;Initial Catalog=Dachser;User ID=sa;Password=sa;");
            }
        }
        */

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //Fake Builder For Procedure
            modelBuilder.Entity<CreateTrailer>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.TrailerId);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<OrderUsedStatus>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.IsOrderNumberAlreadyUsed);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<OrderExistStatus>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.IsValidOrderNo);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<SearchTrailer>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.TrailerId);

                entity.Property(e => e.OrderNumber);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<CommercialInvoice>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.OrderNumber);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<CommercialInvoiceHeader>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.OrderNumber);
                entity.Property(e => e.CustomerReference);

                entity.Property(e => e.SellerName);
                entity.Property(e => e.SellerAddress1);
                entity.Property(e => e.SellerAddress2);
                entity.Property(e => e.SellerAddress3);
                entity.Property(e => e.SellerCityOrTown);
                entity.Property(e => e.SellerStateProvinceCounty);
                entity.Property(e => e.SellerPostalCode);
                entity.Property(e => e.SellerCountry);

                entity.Property(e => e.ImporterName);
                entity.Property(e => e.ImporterAddress1);
                entity.Property(e => e.ImporterAddress2);
                entity.Property(e => e.ImporterAddress3);
                entity.Property(e => e.ImporterCityOrTown);
                entity.Property(e => e.ImporterStateProvinceCounty);
                entity.Property(e => e.ImporterPostalCode);
                entity.Property(e => e.ImporterCountry);

                entity.Property(e => e.Customer);
                entity.Property(e => e.CustomerAddress1);
                entity.Property(e => e.CustomerAddress2);
                entity.Property(e => e.CustomerAddress3);
                entity.Property(e => e.CustomerCity);
                entity.Property(e => e.CustomerCountry);
                entity.Property(e => e.CustomerPostalCode);

                entity.Property(e => e.vatState);
                entity.Property(e => e.VatNumber);
                entity.Property(e => e.IncoTerms);
                entity.Property(e => e.CurrencyCode);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<CommercialInvoiceDetail>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.OrderNumber);
                entity.Property(e => e.OrderLineNo);
                entity.Property(e => e.ProductSKU);
                entity.Property(e => e.DescriptionOfGood);
                entity.Property(e => e.CountryOfOrigin);
                entity.Property(e => e.TariffNumber);
                entity.Property(e => e.LinePrice);
                entity.Property(e => e.CurrencyCode);
                entity.Property(e => e.PreferenceDeclaration);
                entity.Property(e => e.CustomsProcedureCode);
                entity.Property(e => e.NetWeight);
            });
            //Fake Builder For Procedure
            modelBuilder.Entity<CommercialInvoiceFooter>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.OrderNumber);
                entity.Property(e => e.NumberOfPackages);
                entity.Property(e => e.TotalValue);
                entity.Property(e => e.TotalWeight);
                entity.Property(e => e.PrintName);
                entity.Property(e => e.Signature);
                entity.Property(e => e.Position);
                entity.Property(e => e.Date);
            });


            modelBuilder.Entity<DachserDetails>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.CountryOfOrigin)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CurrencyCode)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.CustomsProcedureCode)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.DescriptionOfGood)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.OrderLineNo)
                    .IsRequired()
                    .HasMaxLength(4)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.OrderNumber)
                    .IsRequired()
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.PalletNumber).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.PreferenceDeclaration)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.ProductSku)
                    .HasColumnName("ProductSKU")
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.TariffNumber)
                    .HasMaxLength(10)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<DachserHeader>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Address1)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Address2)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Address3)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.Attention)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CityOrTown)
                    .HasMaxLength(100)
                    .IsUnicode(false);

                entity.Property(e => e.CountryTerritory)
                    .HasMaxLength(2)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CurrencyCode)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.Customer)
                    .HasMaxLength(8)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CustomerReference)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.CvatState)
                    .HasColumnName("CVatState")
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.DateInserted)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DateProgRun).HasColumnType("datetime");

                entity.Property(e => e.EcVatReg)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Flag)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.IncoTerms)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.OrderNumber)
                    .IsRequired()
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.PostalCode)
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.Status)
                    .HasMaxLength(1)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.Telephone)
                    .HasMaxLength(32)
                    .IsUnicode(false);

                entity.Property(e => e.VatExeNumber)
                    .HasMaxLength(20)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<DachserTrailer>(entity =>
            {
                entity.HasNoKey();

                entity.HasIndex(e => e.TrailerId)
                    .HasName("PK_TrailerId")
                    .IsUnique()
                    .IsClustered();

                entity.Property(e => e.CommercialInvoicePrinted).HasDefaultValueSql("((0))");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateInvoicePrinted).HasColumnType("datetime");

                entity.Property(e => e.TrailerDescription)
                    .HasMaxLength(250)
                    .IsUnicode(false);

                entity.Property(e => e.TrailerId).ValueGeneratedOnAdd();

                entity.Property(e => e.TrailerNotes).HasMaxLength(1000);
            });

            modelBuilder.HasSequence("TrailerId");

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);


        public async Task<List<SearchTrailer>> SearchExistingTrailer(int trailerId)
        {
            List<SearchTrailer> orderNumberList = new List<SearchTrailer>();
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                string sqlQuery = "EXEC [dbo].[spSearchExistingTrailer] @TrailerId";
                orderNumberList = await SearchTrailer.FromSqlRaw(sqlQuery, trailerIdParam).ToListAsync();
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return orderNumberList;
        }

        public async Task<int> CreateNewTrailer()
        {
            List<CreateTrailer> createTrailerList = new List<CreateTrailer>();
            try
            {
                string sqlQuery = "EXEC [dbo].[spCreateNewTrailer]";
                createTrailerList = await CreateTrailer.FromSqlRaw(sqlQuery).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return createTrailerList[0].TrailerId;
        }

        public async Task AddOrderToTrailer(int trailerId, string orderNumber){
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spAddOrderToTrailer] @TrailerId, @OrderNumber";
                await Database.ExecuteSqlRawAsync(sql: sqlQuery, parameters: new[] { trailerIdParam, orderNumberParam});
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public async Task RemoveOrderFromTrailer(int trailerId, string orderNumber)
        {
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spRemoveOrderFromTrailer] @TrailerId, @OrderNumber";
                await Database.ExecuteSqlRawAsync(sql: sqlQuery, parameters: new[] { trailerIdParam, orderNumberParam });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

        public async Task<int> DoesOrderNumberExist(string orderNumber)
        {
            List<OrderExistStatus> retList = new List<OrderExistStatus>();
            try
            {
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spDoesOrderNumberExist] @OrderNumber";
                retList = await OrderExistStatus.FromSqlRaw(sqlQuery, orderNumberParam).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return retList[0].IsValidOrderNo;
        }

        public async Task<int> OrderNumberAlreadyUsed(string orderNumber)
        {
            List<OrderUsedStatus> retList = new List<OrderUsedStatus>();
            try
            {
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spOrderNumberAlreadyUsed] @OrderNumber";
                retList = await OrderUsedStatus.FromSqlRaw(sqlQuery, orderNumberParam).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return retList[0].IsOrderNumberAlreadyUsed;
        }

        public async Task<List<CommercialInvoice>> CreateCommercialInvoice(int trailerId)
        {
            List<CommercialInvoice> invoiceList = new List<CommercialInvoice>();
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                string sqlQuery = "EXEC [dbo].[spCreateCommercialInvoice] @TrailerId";
                invoiceList = await CommercialInvoice.FromSqlRaw(sqlQuery, trailerIdParam).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return invoiceList;
        }

        public async Task<CommercialInvoiceHeader> GetCommercialInvoiceHeader(int trailerId, string orderNumber)
        {
            List<CommercialInvoiceHeader> invoiceList = new List<CommercialInvoiceHeader>();
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spCommercialInvoiceHeader] @TrailerId, @OrderNumber";
                invoiceList = await CommercialInvoiceHeader.FromSqlRaw(sqlQuery, new[] { trailerIdParam, orderNumberParam}).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            if (invoiceList.Count > 0)
                return invoiceList[0];
            else
                return null;
        }

        public async Task<List<CommercialInvoiceDetail>> GetCommercialInvoiceDetails(int trailerId, string orderNumber)
        {
            List<CommercialInvoiceDetail> invoiceList = new List<CommercialInvoiceDetail>();
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spCommercialInvoiceDetails] @TrailerId, @OrderNumber";
                invoiceList = await CommercialInvoiceDetail.FromSqlRaw(sql: sqlQuery, parameters: new[] { trailerIdParam, orderNumberParam }).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return invoiceList;
        }

        public async Task<CommercialInvoiceFooter> GetCommercialInvoiceFooter(int trailerId, string orderNumber)
        {
            List<CommercialInvoiceFooter> invoiceList = new List<CommercialInvoiceFooter>();
            try
            {
                SqlParameter trailerIdParam = new SqlParameter("@TrailerId", trailerId);
                SqlParameter orderNumberParam = new SqlParameter("@OrderNumber", orderNumber);
                string sqlQuery = "EXEC [dbo].[spCommercialInvoiceFooter] @TrailerId, @OrderNumber";
                invoiceList = await CommercialInvoiceFooter.FromSqlRaw(sqlQuery, new[] { trailerIdParam, orderNumberParam }).ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

            if (invoiceList.Count > 0)
                return invoiceList[0];
            else
                return null;
        }
    }
}
