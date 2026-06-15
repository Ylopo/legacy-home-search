import type { Metadata } from 'next'
import Script from 'next/script'
import YlopoInit from '@/components/YlopoInit'
import YlopoTrack from '@/components/YlopoTrack'
import LocomotiveScrollInit from '@/components/LocomotiveScrollInit'
import './globals.css'

export const metadata: Metadata = {
  title: 'Legacy Home Search | Real Estate',
  description: 'Legacy Home Search — your trusted partner for buying and selling real estate. Expert guidance, local market knowledge, and dedicated service.',
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness', 'RealEstateAgent'],
  name: 'Legacy Home Team',
  url: 'https://legacyhometeamlpt.com',
  telephone: '+17578164037',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Virginia Beach',
    addressRegion: 'VA',
    addressCountry: 'US',
  },
  areaServed: [
    'Virginia Beach, VA',
    'Norfolk, VA',
    'Chesapeake, VA',
    'Suffolk, VA',
    'Hampton, VA',
    'Portsmouth, VA',
    'Newport News, VA',
  ],
  description: 'Barry Jenkins and the Legacy Home Team help buyers, sellers, and investors across Hampton Roads navigate Virginia Beach real estate with 20+ years of local expertise.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Playfair+Display:ital,wght@1,700;1,900&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) — required iframe fallback, must be first in body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T3VB2GG"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <LocomotiveScrollInit />
        <YlopoInit />
        <YlopoTrack />
        <Script id="ylopo-config" strategy="beforeInteractive">
          {`window.YLOPO_WIDGETS = {"domain": "search.buyingva.com"}`}
        </Script>
        <Script
          src="https://search.buyingva.com/build/js/widgets-1.0.0.js"
          strategy="afterInteractive"
        />
        <Script id="clarity-init" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "we7087qh1c");`}
        </Script>
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');`}
            </Script>
          </>
        )}
        {/* RAEK tracking */}
        <Script id="raek-init" strategy="afterInteractive">
          {`(function(window, document, id){
  var script = document.createElement('script');
  script.id = 'raekTag';
  script.type = 'text/javascript';
  script.src = 'https://cdn.raek.net/js/raek.min.js?id='+id;
  script.async = true;
  document.getElementsByTagName('head')[0].appendChild(script);
})(window, document, "0936002cf8a21fe6f585349319c3c59ae090503bfffbbaa7deeb4559df4da57bc20ab62d26d3c461164491aece8da0ddeec300ad74be49322788958f94eb514f");`}
        </Script>
        {/* OIR tracking */}
        <Script id="oir-queue" strategy="beforeInteractive">
          {`!function(e){e._oirtrk=e._oirtrk||[];}(window);`}
        </Script>
        <Script id="oir-sdk" strategy="afterInteractive" data-oirtyp="6311ae17" data-oirid="PP3977C5P" src="https://cdn.aggle.net/oir/oir.min.js" />
        {/* MM tracking */}
        <Script src="https://mm-uxrv.com/js/mm_5b5c8f43-64b8-42ad-9679-0024549db07b-65354820.js" strategy="afterInteractive" />
        {/* Google Tag Manager */}
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T3VB2GG');`}
        </Script>
        {/* Freshpaint */}
        <Script id="freshpaint-init" strategy="afterInteractive">
          {`(function(c,a){if(!a.__SV){var b=window;try{var d,m,j,k=b.location,f=k.hash;d=function(a,b){return(m=a.match(RegExp(b+"=([^&]*)")))?m[1]:null};f&&d(f,"fpState")&&(j=JSON.parse(decodeURIComponent(d(f,"fpState"))),"fpeditor"===j.action&&(b.sessionStorage.setItem("_fpcehash",f),history.replaceState(j.desiredHash||"",c.title,k.pathname+k.search)))}catch(n){}var l,h;window.freshpaint=a;a._i=[];a.init=function(b,d,g){function c(b,i){var a=i.split(".");2==a.length&&(b=b[a[0]],i=a[1]);b[i]=function(){b.push([i].concat(Array.prototype.slice.call(arguments,0)))}}var e=a;"undefined"!==typeof g?e=a[g]=[]:g="freshpaint";e.people=e.people||[];e.toString=function(b){var a="freshpaint";"freshpaint"!==g&&(a+="."+g);b||(a+=" (stub)");return a};e.people.toString=function(){return e.toString(1)+".people (stub)"};l="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove people group page alias ready addEventProperties addInitialEventProperties removeEventProperty addPageviewProperties registerCallConversion".split(" ");for(h=0;h<l.length;h++)c(e,l[h]);var f="set set_once union unset remove delete".split(" ");e.get_group=function(){function a(c){b[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));e.push([d,call2])}}for(var b={},d=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<f.length;c++)a(f[c]);return b};a._i.push([b,d,g])};a.__SV=1.4;b=c.createElement("script");b.type="text/javascript";b.async=!0;b.src="undefined"!==typeof FRESHPAINT_CUSTOM_LIB_URL?FRESHPAINT_CUSTOM_LIB_URL:"//perfalytics.com/static/js/freshpaint.js";(d=c.getElementsByTagName("script")[0])?d.parentNode.insertBefore(b,d):c.head.appendChild(b)}})(document,window.freshpaint||[]);
freshpaint.init("b6bc3e1a-cd18-40ec-a7f6-45bc74e949c4");
freshpaint.page();`}
        </Script>
      </body>
    </html>
  )
}
