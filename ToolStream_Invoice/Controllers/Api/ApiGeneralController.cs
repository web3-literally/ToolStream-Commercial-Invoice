using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ToolStream_Invoice.DataAccess.Repository;

namespace ToolStream_Invoice.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApiGeneralController : ControllerBase
    {
        private readonly IDataRepository _dataRepository;

        public ApiGeneralController(IDataRepository dataRepository)
        {
            _dataRepository = dataRepository;
        }

        [HttpGet("SearchExistingTrailer")]
        public async Task<IActionResult> SearchExistingTrailer(string TrailerId = "")
        {
            try
            {
                var trailer = await _dataRepository.SearchExistingTrailer(int.Parse(TrailerId));
                return Ok(trailer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CreateNewTrailer")]
        public async Task<IActionResult> CreateNewTrailer()
        {
            try
            {
                var trailer = await _dataRepository.CreateNewTrailer();
                return Ok(trailer);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("AddOrderToTrailer")]
        public async Task<IActionResult> AddOrderToTrailer(string TrailerId = "", string OrderNumber = "")
        {
            try
            {
                if (await _dataRepository.DoesOrderNumberExist(OrderNumber) == 0)
                    return Ok("OrderNumber Not Exist!");
                if (await _dataRepository.OrderNumberAlreadyUsed(OrderNumber) == 1)
                    return Ok("This Order Already Used");

                await _dataRepository.AddOrderToTrailer(int.Parse(TrailerId), OrderNumber);
                return Ok("Success");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("RemoveOrderFromTrailer")]
        public async Task<IActionResult> RemoveOrderFromTrailer(string TrailerId = "", string OrderNumber = "")
        {
            try
            {
                if (await _dataRepository.DoesOrderNumberExist(OrderNumber) == 0)
                    return Ok("OrderNumber Not Exist!");

                await _dataRepository.RemoveOrderFromTrailer(int.Parse(TrailerId), OrderNumber);
                return Ok("Success");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("CreateCommercialInvoice")]
        public async Task<IActionResult> CreateCommercialInvoice(string TrailerId = "")
        {
            try
            {
                var invoiceList = await _dataRepository.CreateCommercialInvoice(int.Parse(TrailerId));
                return Ok(invoiceList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CommercialInvoiceHeader")]
        public async Task<IActionResult> CommercialInvoiceHeader(string TrailerId = "", string OrderNumber = "")
        {
            try
            {
                var result = await _dataRepository.CommercialInvoiceHeader(int.Parse(TrailerId), OrderNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CommercialInvoiceDetails")]
        public async Task<IActionResult> CommercialInvoiceDetails(string TrailerId = "", string OrderNumber = "")
        {
            try
            {
                var result = await _dataRepository.CommercialInvoiceDetails(int.Parse(TrailerId), OrderNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("CommercialInvoiceFooter")]
        public async Task<IActionResult> CommercialInvoiceFooter(string TrailerId = "", string OrderNumber = "")
        {
            try
            {
                var result = await _dataRepository.CommercialInvoiceFooter(int.Parse(TrailerId), OrderNumber);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
