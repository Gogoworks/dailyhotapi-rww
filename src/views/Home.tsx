import type { FC } from "hono/jsx";
import { html } from "hono/html";
import Layout from "./Layout.js";

const Home: FC = () => {
  return (
    <Layout title="DailyHot API">
      <main>
        <div class="page-icon">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAGj9JREFUeF7tXQm0lVX1/+578N7je0xqCJiRCrjM/wr+KTY4azlLyVBmabocUBSyhET/DqWmJhLggIlJuSxQcwANwtRKhTBFaalkxVKQ0kzBYTF+5z7g7v/a917gPXjv3W8eznfOWndd9J6zz96/c37fuzHsTTIoMAe7Zczc4Tj8Q7QWiPQH0AXNvEO0BYHcA/QHYAKz6t/xbklP/qPr3CgAfgegDMK8C8B6Y/wvm/8C236Y1az6OzIicC6ac2x/YfO7WbQ9s3nwAgP3BvB+AgSA6EsAnAgv3JuBDMC8A8CaI3gCwDF26/IPWr1/tTYzJ3RoBQxCP/YFLpQEgOhrAMQAOA7CPRxFxZ18JYBGAZ8D8LJXLy+NWIMv1GYI0aD2W6U+xeAKamo4D8zcA9M5ygwNYBaKHsWXL02hpeZIAmcaZ1AEChiDtAMO23Q+VylAUCieDeajWvYdoHiqV+SgU5pHjvK21rT6MMwSpg8aWtS+IhoN5GIAjfGCpQ5GFIHoMzHNIqbd0MCioDbkmCHfv3gstLaeBaDSAQUHB1Kz8UjBPR7H4EK1b94Fmtrk2J5cEYdsejkrlTBCNcI1UnjMyz0ahMJMcZ07eYMgNQRjoAdseDeYL6+cPeWvrMOxdAaK74TjTCVgbhsC0y9CeIPUF9yUgGlM/jEt7m2RBPwfMd6JQuF33hb22BGHL2gdE48E8Ngs9LrM6Ek0D82RSSs5btEvaEYS7du2DzZsvB9Gl2rVWmg1inoouXSbShg3vp1lNr7ppRRC2rGsAXFm/2+QVC5M/OAJy6HgTKfXj4KLSIUELgrBlnQXgWgD7pgPW3GshZyjXklK/yroSmSYINzcPQaVyA4ATs94Qmur/exQKV9PGjUuyal9mCcKWJcS4KqvA50zvG0mpq7Noc+YIwpZ1LIgmg3lwFgHPrc5Er4F5PCn1hyxhkCmCcHPzwahUpgH4YlaANXp2isCLKBTG0saNL6cdp9QThEulMZDDKJP0Q4B5LJXLd6bZsNQShIECLGsGgHPSDKDRLTAC90Kp8wmoBJYUgYBUEoSLxUEoFH4J4OAIbDYi04fAy6hUzqWWlqVpUy11BGHbHgHm+wB0SxtYRp9IEVgPorPJcWZHWotH4akiCNv2OLn45tEGk10nBIjGk+NMSYtJqSEIl0pTzAXDtHSLhPVgnkrl8riEtahWnwqCsGXNBHBGGgAxOqQGgVmk1JlJa5MoQaoudSzrUQAnJw2EqT+VCMyHUiOTdE2UGEG2aoQW9avAZyZ/fY0FoSIQCznHI30TQVBqqNJqTQZROMaKWx+zwECMZyQu0UxNQSpksS2LwXzFLfKm3yaIhDx3SqviKWKIFWSNDcPQ6Uibk17eDXG5M80AmtRKJwd1a1cv8ikjiBVkhSL/4NC4V4AX/BrmCmXKQQWo1I5J4r3HEFRSCVBWi3e7wGQ0wj3QZs2M+VDfyYbpuWpJkh98T4aRHeFabSRlRIEQnawEIVVqSdIlSRdu34OW7aIt5TDogDByIwdgUVoahoblmueKLXPBEFaTbmMs+woe0M8skPxeBiPqgleNfFrIFvWUQAmm8uOfhFMrNwSAOOD+sqNW/tMjSCtwWHL+hGAa+MGzNTnC4FAIQh81RhSocwSpLo2EfdCTU03gvmrIeFhxISJANFcbNlyld/gNWGq4ldWpgmybW1i298Cs4wo+/sFwpQLFYFlILrOT0zAULUIQZgWBGlFlMvBLBGvuoeAjRHhHYF1ILrRa6hl79XEV0IrglSnXT177galrjDxSuLrRNWamG+BZd1Ma9Z8HHPNkVanHUFajSafQqUyHkTfjxTBvAtnvhWFwmRynHd0hEJbgmwjSnPzJ1GpXAJgLICuOjZiAjZtADANhcLttHHjuwnUH1uV2hNkG1HEkbZtXwTmCwEMiA1pvSpaDqK74Th3EbBeL9PatyY3BGltPtv2cFQqZ4JoRB4aObCNzLNRKMwkx5kTWFbGBOSSINtGle7de6Gl5TQQjQYwKGNtF7W6S8E8HcXiQ7Ru3QdRV5ZW+bkmSJtRxbL2BdFwMA/LsaeVhSB6DMxzSKm30tpp49TLEKQdtNm2+6FSGYpC4WQwD42zQWKvi2geKpX5KBTmkeO8HXv9Ka/QEKRBA1VdExWLJ6Cp6TgwfwNA75S3aSP1VoHoYWzZ8jRaWp5M0qVOI0XT8LshiMdW4FJpAIiOBnBM/X3KPh5FxJ19JYBFAJ4B87NULi+PW4Es12cIErD1uFu3PbB58wHVe2DM+wEYCKIjAXwioGivxT8E8wIAb4LoDQDL0KXLP2j9+tVeBZn82xEwBImwN1SvvThOPxDtBaI9AfQFUW8w9wKwO4D+AGzINK72LR9JTv0jLv7l3ysAfATm1SBaBeB9MP8XzP+Bbb+t2/WOCJvEs+j/By2YYYBiiKyXAAAAAElFTkSuQmCC"
            alt="DailyHot API Logo"
            style="width: 48px; height: 48px;"
          />
        </div>
        <div class="page-header">
          <h1 class="page-title">DailyHot API</h1>
          <p class="page-subtitle">聚合热门数据的 API 接口，服务已正常运行</p>
        </div>
        <div class="page-actions">
          <button id="all-button" class="action-button" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7.71 6.71a.996.996 0 0 0-1.41 0L1.71 11.3a.996.996 0 0 0 0 1.41L6.3 17.3a.996.996 0 1 0 1.41-1.41L3.83 12l3.88-3.88c.38-.39.38-1.03 0-1.41m8.58 0a.996.996 0 0 0 0 1.41L20.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L17.7 6.7c-.38-.38-1.02-.38-1.41.01M8 13c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1m4 0c.55 0 1-.45 1-1s-.45-1-1-1s-1 .45-1 1s.45 1 1 1m4-2c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1"
              />
            </svg>
            <span>全部接口</span>
          </button>
          <button id="radar-button" class="action-button primary" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 3a9 9 0 1 0 9 9a1 1 0 0 0-2 0a7 7 0 1 1-7-7a1 1 0 0 0 0-2m0 4a5 5 0 1 0 5 5a1 1 0 0 0-2 0a3 3 0 1 1-3-3a1 1 0 0 0 0-2m0 4a1 1 0 1 0 1 1a1 1 0 0 0-1-1"
              />
            </svg>
            <span>雷达控制台</span>
          </button>
          <button id="docs-button" class="action-button" type="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3 6c-.55 0-1 .45-1 1v13c0 1.1.9 2 2 2h13c.55 0 1-.45 1-1s-.45-1-1-1H5c-.55 0-1-.45-1-1V7c0-.55-.45-1-1-1m17-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m-2 9h-8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1m-4 4h-4c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1s-.45 1-1 1m4-8h-8c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1"
              />
            </svg>
            <span>项目文档</span>
          </button>
        </div>
      </main>
      {html`
        <script>
          document.getElementById("all-button").addEventListener("click", () => {});
          document.getElementById("radar-button").addEventListener("click", () => {
            window.location.href = "/radar";
          });
          document.getElementById("docs-button").addEventListener("click", () => {});
        </script>
      `}
    </Layout>
  );
};

export default Home;
