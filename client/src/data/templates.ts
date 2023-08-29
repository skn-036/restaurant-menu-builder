import { Template } from '@/types/home/home';

const templates: Template[] = [
    {
        id: 'c7f17922-483b-4917-b1a6-1d75d7bf934c',
        name: 'Demo 1',
        background:
            'data:image/png;base64,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E2Ba5gS4KHMC9OM26Oo9wdX6cNtc9ZbgD/T+8vPqHcEfOiBzApyQOQEelzkBPpA5AbbKnAA9fFulzGms/5E5AWROgPtkToBvy5wAW2ROgG/JnAC9uSy3ehdwYz15a0v1JmAevXibRfUeYD49eMp/9RZgXjtlToB7ZE6AGZkTYJG3E1UvHxZkUuYE+F+ZE2CjzAmwT+YE6L7z6pXDwnXdefXCoQPddl69buhEl51XLxs60l3n1auGznTVefWioUPddF69ZuhUF51XLxk61nnn1SuGznXcefWCoQuddl69XujGL2VOgM6uP69eLXRnr8wJcEHmBJiQOQEW/jro6pVC9868KnPab+SYzGm/h16SOe335g9kTvvdNiZzAszInADzn0CvXiEs3tRpmdN+W16ROe03PiZzAszInAATMifADb6IVi8Neub6X0SrVwa9c90votULg176UOYE2POGzGm/8WUyJ8Dht2VO+619Rua03+oZmRPgwWMyp/2ml8qcAE+/KnPa7+hPZE6Ad7fKnPZ79vInl+p1QF8dXSZzApzaIXMCTMmcADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCSBzAsicADIngMwJIHMCyJwAMieAzAkgcwLInAAyJ4DMCfB/MqnG0LkO5X8AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDgtMjJUMjI6MzY6NDIrMDA6MDBpwhvgAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA4LTIyVDIyOjM2OjQyKzAwOjAwGJ+jXAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wOC0yMlQyMjozNzoxMSswMDowMNlA/UQAAAAASUVORK5CYII=',

        container: `<div class="page-root [{page_root_class}]" style="[{page_root_style}]">
            <div style="width: 100%;">[{restaurant_template}]</div>
            <div style="width: 100%;">[{product_template}]</div>
        </div>`,

        restaurant: `<div class="wrapper-div" style="
            width: 100%;
            color: #ffffff;
            margin-bottom: 48px;
        "
        >
            <div
                style="
                    width: max-content;
                    margin-left: auto;
                "
            >
                <div style="width: max-content; display: flex; flex-direction: row; align-items: center">
                    <div
                        style="
                            font-size: 30px;
                            font-weight: 700;
                            color: #ffffff !important;
                        "
                    >
                        [{template_restaurant_name}]
                    </div>
                    <img
                        src="[{template_restaurant_logo}]"
                        style="
                            width: 75px;
                            height: 75px;
                            border-radius: 9999px;
                            margin-left: 32px;
                            display: [{template_restaurant_logo_display}];
                        "
                    >
                </div>
            </div>

            <div style="margin-left: 96px; margin-top: 36px">
                <div
                    style="
                        padding-left: 0px;
                        text-align: right;
                        font-weight: 700;
                        line-height: 24px;
                        color: #fff;
                    "
                >
                    {[template_restaurant_description]}
                </div>
            </div>
        </div>
`,

        product: `<div class="wrapper-div" style="width: 100% margin-top: 24px;">
        <div
            data-id="[{template_product_id}]"
            style="
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin-top: 24px;
            "
        >
            <img
                src="[{template_product_logo}]"
                style="
                    width: 100px;
                    height: 100px;
                    border-radius: 27px;
                    margin-right: 32px;
                "
            >

            <div
                style="
                    display: flex;
                    flex-direction: row;
                    color: #fff;
                "
            >
                <div style="flex-basis: 1">
                    <div
                        style="
                            font-size: 20px;
                            line-height: 28px;
                        "
                    >
                        {[template_product_name]}
                    </div>
                    <div
                        style="
                            font-size: 14px;
                            color: #f4f4f4;
                        "
                    >
                        {[template_product_description]}
                    </div>
                </div>

                <div
                    style="
                        width: 48px;
                        min-width: 48px;
                        font-weight: 500;
                        font-size: 20px;
                        text-align: right;
                    "
                >
                    {[template_product_price]}
                </div>
            </div>
        </div>
    </div>`,
    },
];

export default templates;
