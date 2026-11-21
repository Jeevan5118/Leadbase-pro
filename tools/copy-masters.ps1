param(
    [string]$SourceDir = "C:\Users\Asus\.gemini\antigravity\brain\3f8b5abc-adb4-475a-92c1-903274898e1b",
    [string]$DestDir = "D:\codeing\lead base pro\assets\img\_masters"
)

if (!(Test-Path $DestDir)) { New-Item -ItemType Directory -Path $DestDir -Force | Out-Null }

$files = Get-ChildItem -Path $SourceDir -Filter "*.jpg"
$patterns = @{
    "hero-deal-handshake"      = "bengaluru_business_handshake_hero"
    "hero-contract-signing"    = "hero_contract_signing"
    "hero-sales-win"           = "hero_sales_win"
    "hero-hospitality-supplier"= "hero_hospitality_supplier"
    "intro-sales-floor"        = "intro_sales_floor"
    "rec-business-name"        = "rec_business_name"
    "rec-contact-number"       = "rec_contact_number"
    "rec-location"             = "rec_location"
    "rec-website"              = "rec_website"
    "rec-category"             = "rec_category"
    "rec-everything-else"      = "rec_everything_else"
    "flip-business-exterior"   = "flip_business_exterior"
    "step-tell-us"             = "step_tell_us"
    "step-market"              = "step_market"
    "step-collect"             = "step_collect"
    "step-close"               = "step_close"
    "bey-distributors"         = "bey_distributors"
    "bey-hospitals"            = "bey_hospitals"
    "bey-real-estate"          = "bey_real_estate"
    "bey-manufacturers"        = "bey_manufacturers"
    "bey-it-companies"         = "bey_it_companies"
    "cta-deal-celebration"     = "cta_deal_celebration"
    "og-image"                 = "og_image"
    "ind-linen"                = "ind_linen"
    "ind-kitchen"              = "ind_kitchen"
    "ind-housekeeping"         = "ind_housekeeping"
    "ind-furniture"            = "ind_furniture"
    "ind-toiletries"           = "ind_toiletries"
    "ind-food"                 = "ind_food"
    "ind-laundry"              = "ind_laundry"
    "ind-cctv"                 = "ind_cctv"
    "ind-interior"             = "ind_interior"
    "ind-software"             = "ind_software"
}

foreach ($target in $patterns.Keys) {
    $pat = $patterns[$target]
    $match = $files | Where-Object { $_.Name -like "*$pat*" } | Sort-Object LastWriteTime -Descending | Select-Object -First 1
    if ($match) {
        $destFile = Join-Path $DestDir "$target.jpg"
        Copy-Item -Path $match.FullName -Destination $destFile -Force
        Write-Host "Matched $target <- $($match.Name)"
    }
}
