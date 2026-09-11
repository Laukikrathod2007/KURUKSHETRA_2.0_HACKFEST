from kurukshetra.contracts import RecipientContext
from kurukshetra.tier0 import check_authority_handle_pattern, check_name_clash, parse_qr_or_deeplink


def test_authority_handle_triggers_on_unverified_personal_account():
    rc = RecipientContext(
        beneficiary_ref_hash="tneb.billing.officer@oksbi",
        raw_handle_string="tneb.billing.officer@oksbi",
        mc_code="0000",
    )
    signal = check_authority_handle_pattern(rc)
    assert signal.triggered is True
    assert "tneb" in signal.evidence["matched_keywords"]


def test_authority_handle_does_not_trigger_on_verified_merchant():
    rc = RecipientContext(
        beneficiary_ref_hash="tneb.official@oksbi",
        raw_handle_string="tneb.official@oksbi",
        mc_code="9311",
    )
    signal = check_authority_handle_pattern(rc)
    assert signal.triggered is False


def test_name_clash_triggers_on_official_purpose_vs_personal_savings():
    rc = RecipientContext(
        beneficiary_ref_hash="arun.kumar1988@sbi",
        raw_handle_string="arun.kumar1988@sbi",
        resolved_name="Arun Kumar",
        mc_code="0000",
        declared_purpose="GOVT_FINE",
    )
    signal = check_name_clash(rc)
    assert signal.triggered is True


def test_qr_parsing_flags_prefilled_amount_to_personal_account():
    signal = parse_qr_or_deeplink("upi://pay?pa=mule7@oksbi&am=12000")
    assert signal is not None
    assert signal.triggered is True
    assert signal.evidence["has_prefilled_amount"] is True


def test_qr_parsing_returns_none_when_no_uri():
    assert parse_qr_or_deeplink(None) is None
