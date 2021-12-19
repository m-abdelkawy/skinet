﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Core.Specifications
{
    public class ProductSpecParams
    {
        public int MaxPageSize = 50;
        public int PageIndex { get; set; } = 1;

        private int _pageSize = 6;
        public int PageSize
        {
            get { return _pageSize; }
            set
            {
                _pageSize = value > MaxPageSize ? MaxPageSize : value;
            }
        }

        public int? BrandId { get; set; }
        public int? TypeId { get; set; }
        public String Sort { get; set; }

        private string _search;
        public string Search
        {
            get { return _search; }
            set { _search = value.ToLower(); }
        }
    }
}