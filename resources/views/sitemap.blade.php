<?= '<?xml version="1.0" encoding="UTF-8"?>' ?>

<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>{{ config('app.url') }}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>{{ config('app.url') }}/privacy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>{{ config('app.url') }}/terms</loc>
        <changefreq>yearly</changefreq>
        <priority>0.5</priority>
    </url>
    @foreach($listings as $listing)
    <url>
        <loc>{{ config('app.url') }}/listings/{{ $listing->id }}</loc>
        <lastmod>{{ $listing->updated_at->toIso8601String() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
    @endforeach
    @foreach($portfolios as $portfolio)
    <url>
        <loc>{{ config('app.url') }}/portfolios/{{ $portfolio->id }}</loc>
        <lastmod>{{ $portfolio->updated_at->toIso8601String() }}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
    @endforeach
</urlset>
